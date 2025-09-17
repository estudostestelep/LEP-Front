import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ShimmerButton from "@/components/magicui/shimmer-button";
import {
  ShoppingCart,
  Plus,
  Minus,
  Utensils,
  Clock,
  Star,
  ChefHat
} from "lucide-react";
import { mockProducts, Product } from "@/lib/mock-data";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function PublicMenu() {
  const [tableNumber, setTableNumber] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredProducts = selectedCategory === "all"
    ? mockProducts.filter(p => p.available)
    : mockProducts.filter(p => p.category === selectedCategory && p.available);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter(item => item.product.id !== productId);
      }
    });
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleFinishOrder = async () => {
    if (!tableNumber.trim()) {
      alert("Por favor, informe o número da mesa!");
      return;
    }

    if (cart.length === 0) {
      alert("Adicione itens ao seu pedido!");
      return;
    }

    console.log({
      tableNumber: tableNumber.trim(),
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: getTotalPrice()
    });

    alert("Pedido enviado com sucesso! Aguarde, em breve será preparado.");
    setCart([]);
    setTableNumber("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Cardápio Digital</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Descubra nossos pratos deliciosos e faça seu pedido
          </p>
        </div>

        {/* Table Number Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Utensils className="h-5 w-5" />
              <span>Informações do Pedido</span>
            </CardTitle>
            <CardDescription>
              Informe o número da sua mesa para começar o pedido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Número da Mesa
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 12"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="text-lg"
                />
              </div>
              {cart.length > 0 && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total do Pedido</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {getTotalPrice().toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Categorias</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === "all" ? "Todos" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => {
            const quantity = getCartItemQuantity(product.id);

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">4.8</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">15-20 min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      R$ {product.price.toFixed(2)}
                    </span>

                    {quantity === 0 ? (
                      <Button
                        onClick={() => addToCart(product)}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Adicionar</span>
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => removeFromCart(product.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <Button
                          onClick={() => addToCart(product)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cart Summary and Finish Order */}
        {cart.length > 0 && (
          <Card className="sticky bottom-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Resumo do Pedido</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <span className="text-sm">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="text-sm font-medium">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">
                    Total: R$ {getTotalPrice().toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {cart.reduce((total, item) => total + item.quantity, 0)} itens
                  </p>
                </div>

                <ShimmerButton
                  onClick={handleFinishOrder}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!tableNumber.trim()}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Finalizar Pedido
                </ShimmerButton>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}