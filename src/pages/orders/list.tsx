import { useEffect, useState } from "react";
import { orderService, Order } from "@/api/ordersService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ShoppingCart, Plus, Edit, Trash2, Clock } from "lucide-react";
import OrderForm from "./form";
import ConfirmModal from "@/components/confirmModal";
import { AxiosError } from "axios";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await orderService.getAll();
      setOrders(response.data);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setError(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao carregar pedidos"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      await orderService.remove(orderToDelete);
      setOrders(orders.filter(o => o.id !== orderToDelete));
      setShowConfirm(false);
      setOrderToDelete(null);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao excluir pedido"
      );
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOrder(null);
    fetchOrders();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "preparing": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "delivered": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pendente";
      case "preparing": return "Preparando";
      case "ready": return "Pronto";
      case "delivered": return "Entregue";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8" />
              <span>Gerenciar Pedidos</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todos os pedidos do restaurante
            </p>
          </div>

          <Button
            size="lg"
            className="flex items-center space-x-2"
            onClick={handleNewOrder}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Pedido</span>
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchOrders}
                  className="ml-auto"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{order.id?.slice(-6)}
                      </CardTitle>
                      <CardDescription>
                        {order.table_number ? `Mesa ${order.table_number}` : 'Balcão'}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditOrder(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => order.id && handleDeleteClick(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>

                  {order.total_amount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-semibold text-lg">
                        R$ {order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Itens</span>
                    <span className="text-sm">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} itens
                    </span>
                  </div>

                  {order.source && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Origem</span>
                      <Badge variant="outline">
                        {order.source === 'internal' ? 'Interno' : 'Público'}
                      </Badge>
                    </div>
                  )}

                  {order.created_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Criado</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro pedido.
              </p>
              <Button onClick={handleNewOrder}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <OrderForm
                initialData={editingOrder || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        <ConfirmModal
          open={showConfirm}
          title="Excluir Pedido"
          message="Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowConfirm(false);
            setOrderToDelete(null);
          }}
        />
      </div>
    </div>
  );
}