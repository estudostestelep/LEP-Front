import { useState, useEffect } from "react";
import { orderService, Order, CreateOrderRequest, OrderItem } from "@/api/ordersService";
import { productService, Product } from "@/api/productService";
import { tableService, Table } from "@/api/tableService";
import { customerService, Customer } from "@/api/customerService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/authContext";
import { Plus, Minus, Trash2 } from "lucide-react";

interface Props {
  initialData?: Order;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  table_id?: string;
  table_number?: number;
  customer_id?: string;
  items: OrderItem[];
  note?: string;
  source: "internal" | "public";
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
}

export default function OrderForm({ initialData, onSuccess, onCancel }: Props) {
  const { user } = useAuth();
  const [form, setForm] = useState<FormData>({
    table_id: initialData?.table_id || "",
    table_number: initialData?.table_number || undefined,
    customer_id: initialData?.customer_id || "",
    items: initialData?.items || [],
    note: initialData?.note || "",
    source: initialData?.source || "internal",
    status: initialData?.status || "pending"
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, tablesRes, customersRes] = await Promise.all([
          productService.getAll(),
          tableService.getAll(),
          customerService.getAll()
        ]);
        setProducts(productsRes.data);
        setTables(tablesRes.data);
        setCustomers(customersRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const addProduct = () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItem = form.items.find(item => item.product_id === selectedProduct);

    if (existingItem) {
      setForm(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.product_id === selectedProduct
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      setForm(prev => ({
        ...prev,
        items: [
          ...prev.items,
          {
            product_id: selectedProduct,
            quantity: 1,
            product_name: product.name,
            prep_time_minutes: product.prep_time_minutes
          }
        ]
      }));
    }

    setSelectedProduct("");
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setForm(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      )
    }));
  };

  const removeItem = (productId: string) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product_id !== productId)
    }));
  };

  const calculateTotal = () => {
    return form.items.reduce((total, item) => {
      const product = products.find(p => p.id === item.product_id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.organization_id || !user?.project_id) {
      alert("Erro: dados de organização não encontrados");
      return;
    }

    if (form.items.length === 0) {
      alert("Adicione pelo menos um item ao pedido");
      return;
    }

    try {
      setIsSubmitting(true);

      if (initialData?.id) {
        // Atualizar pedido existente
        await orderService.update(initialData.id, form);
      } else {
        // Criar novo pedido
        const createData: CreateOrderRequest = {
          organization_id: user.organization_id,
          project_id: user.project_id,
          table_id: form.table_id,
          table_number: form.table_number,
          customer_id: form.customer_id,
          items: form.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
          })),
          note: form.note,
          source: form.source
        };
        await orderService.create(createData);
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      alert("Erro ao salvar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? "Editar Pedido" : "Novo Pedido"}</span>
            <Badge variant={form.status === "pending" ? "default" : "secondary"}>
              {form.status === "pending" ? "Pendente" :
               form.status === "preparing" ? "Preparando" :
               form.status === "ready" ? "Pronto" :
               form.status === "delivered" ? "Entregue" : "Cancelado"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Mesa
                </label>
                <select
                  name="table_id"
                  value={form.table_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                  disabled={isSubmitting}
                >
                  <option value="">Selecione uma mesa</option>
                  {tables.map(table => (
                    <option key={table.id} value={table.id}>
                      Mesa {table.number} - {table.capacity} lugares
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Número da Mesa (Balcão)
                </label>
                <Input
                  type="number"
                  name="table_number"
                  value={form.table_number || ""}
                  onChange={handleChange}
                  placeholder="Ex: 1"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Cliente */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Cliente
              </label>
              <select
                name="customer_id"
                value={form.customer_id || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                disabled={isSubmitting}
              >
                <option value="">Selecione um cliente (opcional)</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            {/* Origem e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Origem
                </label>
                <select
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                  disabled={isSubmitting}
                >
                  <option value="internal">Interno</option>
                  <option value="public">Público</option>
                </select>
              </div>

              {initialData && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                    disabled={isSubmitting}
                  >
                    <option value="pending">Pendente</option>
                    <option value="preparing">Preparando</option>
                    <option value="ready">Pronto</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              )}
            </div>

            {/* Adicionar produtos */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Adicionar Produto
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="flex-1 px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                  disabled={isSubmitting}
                >
                  <option value="">Selecione um produto</option>
                  {products.filter(p => p.available).map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - R$ {product.price.toFixed(2)}
                    </option>
                  ))}
                </select>
                <Button type="button" onClick={addProduct} disabled={!selectedProduct || isSubmitting}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lista de itens */}
            {form.items.length > 0 && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Itens do Pedido
                </label>
                <div className="space-y-2">
                  {form.items.map((item) => {
                    const product = products.find(p => p.id === item.product_id);
                    const itemTotal = (product?.price || 0) * item.quantity;

                    return (
                      <div key={item.product_id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex-1">
                          <div className="font-medium">{item.product_name || product?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            R$ {product?.price.toFixed(2)} cada
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.product_id, item.quantity - 1)}
                            disabled={isSubmitting}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="w-8 text-center">{item.quantity}</span>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.product_id, item.quantity + 1)}
                            disabled={isSubmitting}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          <div className="w-20 text-right font-medium">
                            R$ {itemTotal.toFixed(2)}
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.product_id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-between items-center pt-4 border-t font-bold text-lg">
                    <span>Total:</span>
                    <span>R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Observações */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Observações
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Observações do pedido..."
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md"
                disabled={isSubmitting}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || form.items.length === 0}
                className="flex-1"
              >
                {isSubmitting ? "Salvando..." : (initialData ? "Atualizar" : "Criar Pedido")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}