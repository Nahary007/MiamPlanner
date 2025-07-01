import React, { useEffect, useState } from 'react';
import { Plus, AlertTriangle, Package, Calendar } from 'lucide-react';
import { format, isBefore, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { stockAPI } from '../services/api';
import type { StockItem } from '../types';
import toast from 'react-hot-toast';
import StockModal from '../components/Stock/StockModal';

const Stock: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'expiring' | 'expired'>('all');

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const data = await stockAPI.getAll();
      setStockItems(data);
    } catch (error: any) {
      toast.error('Erreur lors du chargement du stock');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: StockItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      await stockAPI.delete(id);
      setStockItems(prev => prev.filter(item => item.id !== id));
      toast.success('Article supprimé');
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleItemSaved = (item: StockItem) => {
    if (editingItem) {
      setStockItems(prev => prev.map(i => i.id === item.id ? item : i));
      toast.success('Article modifié');
    } else {
      setStockItems(prev => [item, ...prev]);
      toast.success('Article ajouté');
    }
    setIsModalOpen(false);
  };

  const getExpirationStatus = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);

    if (isBefore(expDate, today)) {
      return { status: 'expired', label: 'Expiré', color: 'text-red-600 bg-red-100' };
    } else if (isBefore(expDate, threeDaysFromNow)) {
      return { status: 'expiring', label: 'Bientôt expiré', color: 'text-orange-600 bg-orange-100' };
    }
    return { status: 'good', label: 'Bon état', color: 'text-green-600 bg-green-100' };
  };

  const filteredItems = stockItems.filter(item => {
    if (filter === 'all') return true;
    const status = getExpirationStatus(item.expirationDate).status;
    if (filter === 'expiring') return status === 'expiring';
    if (filter === 'expired') return status === 'expired';
    return true;
  });

  const expiringCount = stockItems.filter(item => 
    getExpirationStatus(item.expirationDate).status === 'expiring'
  ).length;

  const expiredCount = stockItems.filter(item => 
    getExpirationStatus(item.expirationDate).status === 'expired'
  ).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
          Stock alimentaire
        </h1>
        <button
          onClick={handleAddItem}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter au stock
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total articles</h3>
              <p className="text-2xl font-bold text-blue-600">{stockItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bientôt expirés</h3>
              <p className="text-2xl font-bold text-orange-600">{expiringCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Expirés</h3>
              <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({stockItems.length})
          </button>
          <button
            onClick={() => setFilter('expiring')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'expiring'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bientôt expirés ({expiringCount})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'expired'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expirés ({expiredCount})
          </button>
        </div>
      </div>

      {/* Stock Items */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const expiration = getExpirationStatus(item.expirationDate);
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.ingredient.name_ingredient}
                    </h3>
                    <p className="text-gray-600">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Package className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Expire le</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(item.expirationDate), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${expiration.color}`}>
                      {expiration.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Aucun article en stock' : 'Aucun article trouvé'}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Commencez par ajouter vos premiers ingrédients'
              : 'Aucun article ne correspond à ce filtre'
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={handleAddItem}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un article
            </button>
          )}
        </div>
      )}

      {/* Stock Modal */}
      <StockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stockItem={editingItem}
        onSaved={handleItemSaved}
      />
    </div>
  );
};

export default Stock;