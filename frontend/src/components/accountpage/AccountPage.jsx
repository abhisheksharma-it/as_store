// src/components/accountpage/AccountPage.jsx
import React, { useState, useEffect } from 'react';
import AccountSidebar from './AccountSidebar';
import OverviewTab from './OverviewTab';
import PurchasesTab from './PurchasesTab';
import AddressesTab from './AddressesTab';
import ReturnsTab from './ReturnsTab';
import DetailsTab from './DetailsTab';
import RefundsTab from './RefundsTab';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access') || localStorage.getItem('token');
        const res = await fetch('http://127.0.0.1:8000/api/orders/api/my-orders/', {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            : {
                'Content-Type': 'application/json',
              },
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : data.orders || data.results || []);
        } else {
          console.error('API Error Status:', res.status);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderContent = () => {
    const currentTab = activeTab?.toLowerCase();

    switch (currentTab) {
      case 'overview':
      case 'my account':
        return <OverviewTab onSelect={setActiveTab} orders={orders} />;

      case 'purchases':
      case 'my purchases':
        return (
          <PurchasesTab
            orders={orders}
            isLoading={isLoading}
            onOrderUpdate={setOrders}
            onSelectTab={setActiveTab}
          />
        );

      case 'addresses':
      case 'my addresses':
        return <AddressesTab />;

      case 'returns':
        return <ReturnsTab orders={orders} onOrderUpdate={setOrders} />;

      case 'refunds':
        return <RefundsTab orders={orders} />;

      case 'details':
      case 'my details':
      case 'my-details':
        return <DetailsTab />;

      default:
        return <OverviewTab onSelect={setActiveTab} orders={orders} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white antialiased pt-32 pb-24 lg:pt-40">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <AccountSidebar activeTab={activeTab} onSelect={setActiveTab} />
          <main className="min-w-0 flex-1">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}