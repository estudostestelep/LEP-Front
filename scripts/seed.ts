/**
 * Script de Seed - Popular dados iniciais na aplicação
 *
 * Este script cria dados de exemplo para todas as entidades:
 * - Tags
 * - Menus
 * - Categories
 * - Subcategories
 * - Products (Pratos, Bebidas e Vinhos)
 *
 * Para executar: ts-node scripts/seed.ts
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Configurar headers (você precisará substituir com dados reais de autenticação)
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE', // Substitua pelo token real
  'X-Lpe-Organization-Id': 'org-seed-123',
  'X-Lpe-Project-Id': 'proj-seed-456'
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers
});

// Cores padrão para tags
const TAG_COLORS = {
  glutenFree: '#10B981',
  vegetarian: '#F59E0B',
  vegan: '#8B5CF6',
  lactoseFree: '#3B82F6',
  spicy: '#EF4444',
  organic: '#059669',
  lowCarb: '#6366F1',
  fit: '#14B8A6'
};

async function seedTags() {
  console.log('\n🏷️  Criando Tags...');

  const tags = [
    { name: 'Sem Glúten', color: TAG_COLORS.glutenFree, description: 'Produtos sem glúten', entity_type: 'product', active: true },
    { name: 'Vegetariano', color: TAG_COLORS.vegetarian, description: 'Produtos vegetarianos', entity_type: 'product', active: true },
    { name: 'Vegano', color: TAG_COLORS.vegan, description: 'Produtos veganos', entity_type: 'product', active: true },
    { name: 'Sem Lactose', color: TAG_COLORS.lactoseFree, description: 'Produtos sem lactose', entity_type: 'product', active: true },
    { name: 'Picante', color: TAG_COLORS.spicy, description: 'Produtos picantes', entity_type: 'product', active: true },
    { name: 'Orgânico', color: TAG_COLORS.organic, description: 'Produtos orgânicos', entity_type: 'product', active: true },
    { name: 'Low Carb', color: TAG_COLORS.lowCarb, description: 'Baixo carboidrato', entity_type: 'product', active: true },
    { name: 'Fit', color: TAG_COLORS.fit, description: 'Opções fitness', entity_type: 'product', active: true }
  ];

  const createdTags: any[] = [];

  for (const tag of tags) {
    try {
      const response = await api.post('/tag', tag);
      createdTags.push(response.data);
      console.log(`  ✅ Tag criada: ${tag.name}`);
    } catch (error: any) {
      console.error(`  ❌ Erro ao criar tag ${tag.name}:`, error.response?.data || error.message);
    }
  }

  return createdTags;
}

async function seedMenus() {
  console.log('\n📋 Criando Menus...');

  const menus = [
    {
      name: 'Cardápio Principal',
      styling: {
        colors: { primary: '#FF5733', secondary: '#C70039', accent: '#900C3F' },
        fonts: { title: 'Playfair Display', body: 'Roboto' },
        layout: 'grid' as const
      },
      order: 0,
      active: true
    },
    {
      name: 'Menu Executivo',
      styling: {
        colors: { primary: '#2E86AB', secondary: '#A23B72', accent: '#F18F01' },
        layout: 'list' as const
      },
      order: 1,
      active: true
    },
    {
      name: 'Carta de Vinhos',
      styling: {
        colors: { primary: '#722F37', secondary: '#C73E1D', accent: '#F4A259' },
        layout: 'cards' as const
      },
      order: 2,
      active: true
    }
  ];

  const createdMenus: any[] = [];

  for (const menu of menus) {
    try {
      const response = await api.post('/menu', menu);
      createdMenus.push(response.data);
      console.log(`  ✅ Menu criado: ${menu.name}`);
    } catch (error: any) {
      console.error(`  ❌ Erro ao criar menu ${menu.name}:`, error.response?.data || error.message);
    }
  }

  return createdMenus;
}

async function seedCategories(menuId: string) {
  console.log('\n📁 Criando Categorias...');

  const categories = [
    { menu_id: menuId, name: 'Entradas', order: 0, active: true },
    { menu_id: menuId, name: 'Pratos Principais', order: 1, active: true },
    { menu_id: menuId, name: 'Massas', order: 2, active: true },
    { menu_id: menuId, name: 'Carnes', order: 3, active: true },
    { menu_id: menuId, name: 'Peixes e Frutos do Mar', order: 4, active: true },
    { menu_id: menuId, name: 'Sobremesas', order: 5, active: true },
    { menu_id: menuId, name: 'Bebidas', order: 6, active: true }
  ];

  const createdCategories: any[] = [];

  for (const category of categories) {
    try {
      const response = await api.post('/category', category);
      createdCategories.push(response.data);
      console.log(`  ✅ Categoria criada: ${category.name}`);
    } catch (error: any) {
      console.error(`  ❌ Erro ao criar categoria ${category.name}:`, error.response?.data || error.message);
    }
  }

  return createdCategories;
}

async function seedSubcategories() {
  console.log('\n🗂️  Criando Subcategorias...');

  const subcategories = [
    { name: 'Saladas', order: 0, active: true },
    { name: 'Sopas', order: 1, active: true },
    { name: 'Massas Artesanais', order: 2, active: true },
    { name: 'Risotos', order: 3, active: true },
    { name: 'Grelhados', order: 4, active: true },
    { name: 'Assados', order: 5, active: true },
    { name: 'Tortas e Bolos', order: 6, active: true },
    { name: 'Sorvetes', order: 7, active: true }
  ];

  const createdSubcategories: any[] = [];

  for (const subcategory of subcategories) {
    try {
      const response = await api.post('/subcategory', subcategory);
      createdSubcategories.push(response.data);
      console.log(`  ✅ Subcategoria criada: ${subcategory.name}`);
    } catch (error: any) {
      console.error(`  ❌ Erro ao criar subcategoria ${subcategory.name}:`, error.response?.data || error.message);
    }
  }

  return createdSubcategories;
}

async function seedProducts(categoryId: string, subcategoryId: string) {
  console.log('\n🍽️  Criando Produtos...');

  const products = [
    // Pratos
    {
      name: 'Risoto de Cogumelos',
      description: 'Risoto cremoso com mix de cogumelos selvagens e parmesão',
      type: 'prato' as const,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      price_normal: 58.90,
      prep_time_minutes: 35,
      order: 0,
      active: true
    },
    {
      name: 'Salmão Grelhado',
      description: 'Filé de salmão grelhado com risoto de limão siciliano',
      type: 'prato' as const,
      category_id: categoryId,
      price_normal: 78.90,
      prep_time_minutes: 30,
      order: 1,
      active: true
    },
    {
      name: 'Picanha na Brasa',
      description: 'Picanha premium grelhada na brasa com farofa e vinagrete',
      type: 'prato' as const,
      category_id: categoryId,
      price_normal: 89.90,
      prep_time_minutes: 40,
      order: 2,
      active: true
    },

    // Bebidas
    {
      name: 'Suco Natural de Laranja',
      description: 'Suco de laranja natural espremido na hora',
      type: 'bebida' as const,
      category_id: categoryId,
      price_normal: 12.90,
      volume: 500,
      prep_time_minutes: 5,
      order: 3,
      active: true
    },
    {
      name: 'Cerveja Artesanal IPA',
      description: 'Cerveja artesanal India Pale Ale 500ml',
      type: 'bebida' as const,
      category_id: categoryId,
      price_normal: 18.90,
      volume: 500,
      alcohol_content: 6.5,
      prep_time_minutes: 2,
      order: 4,
      active: true
    },

    // Vinhos
    {
      name: 'Cabernet Sauvignon Reserva',
      description: 'Vinho tinto encorpado com notas de frutas vermelhas',
      type: 'vinho' as const,
      category_id: categoryId,
      price_normal: 120.00,
      price_bottle: 120.00,
      price_half_bottle: 65.00,
      price_glass: 25.00,
      vintage: '2019',
      country: 'Chile',
      region: 'Vale do Maipo',
      winery: 'Concha y Toro',
      wine_type: 'Tinto Seco',
      grapes: ['Cabernet Sauvignon', 'Merlot'],
      volume: 750,
      alcohol_content: 13.5,
      order: 5,
      active: true
    },
    {
      name: 'Chardonnay Premium',
      description: 'Vinho branco elegante com notas de frutas tropicais',
      type: 'vinho' as const,
      category_id: categoryId,
      price_normal: 95.00,
      price_bottle: 95.00,
      price_glass: 20.00,
      vintage: '2020',
      country: 'Argentina',
      region: 'Mendoza',
      winery: 'Catena Zapata',
      wine_type: 'Branco Seco',
      grapes: ['Chardonnay'],
      volume: 750,
      alcohol_content: 13.0,
      order: 6,
      active: true
    }
  ];

  const createdProducts: any[] = [];

  for (const product of products) {
    try {
      const response = await api.post('/product', product);
      createdProducts.push(response.data);
      console.log(`  ✅ Produto criado: ${product.name} (${product.type})`);
    } catch (error: any) {
      console.error(`  ❌ Erro ao criar produto ${product.name}:`, error.response?.data || error.message);
    }
  }

  return createdProducts;
}

async function linkTagsToProducts(productIds: string[], tagIds: string[]) {
  console.log('\n🔗 Vinculando Tags aos Produtos...');

  // Vincular algumas tags a alguns produtos
  const links = [
    { productIndex: 0, tagIndices: [0, 1] }, // Risoto: Sem Glúten, Vegetariano
    { productIndex: 1, tagIndices: [0, 7] }, // Salmão: Sem Glúten, Fit
    { productIndex: 3, tagIndices: [1, 2, 3] }, // Suco: Vegetariano, Vegano, Sem Lactose
  ];

  for (const link of links) {
    const productId = productIds[link.productIndex];
    for (const tagIndex of link.tagIndices) {
      const tagId = tagIds[tagIndex];
      try {
        await api.post(`/product/${productId}/tags`, { tag_id: tagId });
        console.log(`  ✅ Tag vinculada ao produto ${link.productIndex}`);
      } catch (error: any) {
        console.error(`  ❌ Erro ao vincular tag:`, error.response?.data || error.message);
      }
    }
  }
}

async function runSeed() {
  console.log('\n🌱 Iniciando Seed...\n');
  console.log('⚠️  ATENÇÃO: Certifique-se de que:');
  console.log('  1. O backend está rodando em http://localhost:8080');
  console.log('  2. Você atualizou o token JWT e IDs de org/project no início deste arquivo');
  console.log('  3. O usuário tem permissões para criar esses recursos\n');

  try {
    // Testar conexão
    await api.get('/ping');
    console.log('✅ Conexão com backend OK\n');

    // Executar seed em ordem
    const tags = await seedTags();
    const menus = await seedMenus();

    if (menus.length > 0) {
      const categories = await seedCategories(menus[0].id);
      const subcategories = await seedSubcategories();

      if (categories.length > 0 && subcategories.length > 0) {
        const products = await seedProducts(categories[1].id, subcategories[2].id);

        if (products.length > 0 && tags.length > 0) {
          await linkTagsToProducts(
            products.map(p => p.id),
            tags.map(t => t.id)
          );
        }
      }
    }

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`  Tags: ${tags.length}`);
    console.log(`  Menus: ${menus.length}`);
    console.log('\n🎉 Dados iniciais criados! Você pode acessar a aplicação agora.');

  } catch (error: any) {
    console.error('\n❌ Erro fatal durante seed:', error.response?.data || error.message);
    console.error('\n💡 Dicas:');
    console.error('  - Verifique se o backend está rodando');
    console.error('  - Verifique se o token JWT está válido');
    console.error('  - Verifique se os headers de org/project estão corretos');
  }
}

// Executar seed
runSeed();
