def resolve_media_url(request, raw_url):
    if not raw_url:
        return None
    if raw_url.startswith(("http://", "https://")):
        return raw_url
    if raw_url.startswith("//"):
        return f"https:{raw_url}"
    if request:
        return request.build_absolute_uri(raw_url)
    return raw_url
