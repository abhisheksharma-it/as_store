# backend/orders/ai_stylist.py
import os
import json
import urllib.request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from catalog.models import Product


class AIStylistView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    def post(self, request):
        prompt = request.data.get("prompt", "").strip()
        image_base64 = request.data.get("image_base64", "")
        mime_type = request.data.get("mime_type", "image/jpeg")

        if not prompt and not image_base64:
            return Response({"error": "Prompt or outfit image is required."}, status=400)

        products = Product.objects.filter(stock__gt=0)[:30]
        catalog = [
            {
                "id": p.id,
                "title": p.title,
                "price": float(p.price),
                "color": getattr(p, "color_name", "Standard"),
                "image": p.image.url if getattr(p, "image", None) else getattr(p, "image_url", ""),
            }
            for p in products
        ]

        api_key = os.environ.get("GEMINI_API_KEY", "")
        reply_text = "Based on your visual style, here are the closest pieces from our collection:"
        rec_ids = []

        if api_key and api_key != "your_gemini_api_key_here":
            try:
                sys_prompt = (
                    "You are the luxury AI Visual Stylist for A&S Store. "
                    "Analyze the user's text and/or uploaded outfit photo (color, silhouette, vibe) "
                    f"and match it strictly against this Catalog JSON: {json.dumps(catalog)}. "
                    'Return strictly JSON: {"reply": "1-2 sentence styling breakdown", "product_ids": [1, 2]}'
                )
                parts = [{"text": f"{sys_prompt}\nUser Request: {prompt or 'Find matching pieces for this photo.'}"}]
                if image_base64:
                    parts.append({"inlineData": {"mimeType": mime_type, "data": image_base64}})

                payload = {
                    "contents": [{"parts": parts}],
                    "generationConfig": {"responseMimeType": "application/json"},
                }
                req = urllib.request.Request(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}",
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                )
                with urllib.request.urlopen(req, timeout=12) as res:
                    result = json.loads(res.read().decode("utf-8"))
                    ai_json = json.loads(result["candidates"][0]["content"]["parts"][0]["text"])
                    reply_text = ai_json.get("reply", reply_text)
                    rec_ids = ai_json.get("product_ids", [])
            except Exception as e:
                print("Multimodal AI Fallback:", e)

        if not rec_ids:
            rec_ids = [p["id"] for p in catalog[:3]]

        recommended = [p for p in catalog if p["id"] in rec_ids][:4]
        return Response({"reply": reply_text, "products": recommended})