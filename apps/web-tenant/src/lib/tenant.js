/**
 * Mock Tenant Configuration & Resolver
 * Enables multi-tenant dynamic theming and content isolation.
 */

export const MOCK_TENANTS = [
  {
    tenantId: 'kopi-senja',
    domain: 'localhost',
    storeName: 'Kopi Senja Artisanal Roastery',
    tagline: 'Freshly roasted single-origin Indonesian beans crafted for coffee connoisseurs.',
    themeColor: '#854d0e', // Warm artisanal amber/coffee tone
    logoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=120&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'ks-001',
        name: 'Aceh Gayo Single-Origin Beans (250g)',
        price: 85000,
        currency: 'IDR',
        category: 'Whole Bean',
        rating: 4.9,
        reviewCount: 142,
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
        description: 'Naturally processed high-altitude Arabica featuring rich notes of dark chocolate, dried plum, and wild honey.',
        features: ['Medium Roast', 'Altitude: 1,500m', 'Direct Trade', '100% Arabica'],
        inStock: true
      },
      {
        id: 'ks-002',
        name: 'Toraja Kalosi Heritage Roast (250g)',
        price: 95000,
        currency: 'IDR',
        category: 'Whole Bean',
        rating: 4.8,
        reviewCount: 98,
        imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80',
        description: 'Full-bodied traditional wet-hulled roast with herbal undertones, cedar aromatics, and a silky syrupy finish.',
        features: ['Dark Roast', 'Sulawesi Highlands', 'Low Acidity', 'Specialty Grade'],
        inStock: true
      },
      {
        id: 'ks-003',
        name: 'Senja Cold Brew Blend Bottle (500ml)',
        price: 35000,
        currency: 'IDR',
        category: 'Ready to Drink',
        rating: 4.7,
        reviewCount: 65,
        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80',
        description: 'Steeped for 18 hours in filtered spring water. Naturally sweet, dense, and invigorating.',
        features: ['Zero Sugar Added', '18-Hour Slow Steep', 'Keep Refrigerated', 'Ready to Serve'],
        inStock: true
      },
      {
        id: 'ks-004',
        name: 'Artisan Ceramic V60 Pour-Over Dripper',
        price: 185000,
        currency: 'IDR',
        category: 'Brewing Equipment',
        rating: 5.0,
        reviewCount: 31,
        imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
        description: 'Handmade stoneware dripper engineered with precision spiral ribs for optimal thermal retention and extraction.',
        features: ['Handcrafted Ceramic', 'Compatible with 02 Filters', 'Dishwasher Safe', 'Heat Retentive'],
        inStock: true
      }
    ]
  },
  {
    tenantId: 'techgear-store',
    domain: '127.0.0.1',
    storeName: 'TechGear Store',
    tagline: 'High-performance workspace gear engineered for developers and digital creators.',
    themeColor: '#2563eb', // Vivid electric blue
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'tg-101',
        name: 'AeroMech Pro Wireless 75% Keyboard',
        price: 1450000,
        currency: 'IDR',
        category: 'Peripherals',
        rating: 4.9,
        reviewCount: 320,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        description: 'CNC anodized aluminum body, hot-swappable tactile switches, gasket-mounted dampening, and low-latency 2.4GHz wireless.',
        features: ['Hot-Swappable Switches', 'Gasket Mount Structure', 'Triple-Mode Connectivity', 'RGB Per-Key Backlight'],
        inStock: true
      },
      {
        id: 'tg-102',
        name: 'ErgoGlide Precision Ergonomic Mouse',
        price: 650000,
        currency: 'IDR',
        category: 'Peripherals',
        rating: 4.7,
        reviewCount: 184,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        description: 'Sculpted natural 57-degree vertical grip that alleviates forearm wrist strain during extended coding sessions.',
        features: ['4000 DPI Sensor', 'Hyper-Fast Scroll Wheel', 'Rechargeable 70-Day Battery', 'Multi-Device Flow'],
        inStock: true
      },
      {
        id: 'tg-103',
        name: 'Apex 100W GaN Fast Charger & Hub',
        price: 425000,
        currency: 'IDR',
        category: 'Power & Hubs',
        rating: 4.8,
        reviewCount: 215,
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
        description: 'Compact Gallium Nitride (GaN) multi-port charging station capable of powering dual laptops and accessories at full speed.',
        features: ['100W Max Output', '3x USB-C + 1x USB-A', 'GaNFast Architecture', 'Over-Temperature Protection'],
        inStock: true
      },
      {
        id: 'tg-104',
        name: 'Minimalist Merino Wool Desk Mat (90x40cm)',
        price: 225000,
        currency: 'IDR',
        category: 'Workspace',
        rating: 4.6,
        reviewCount: 89,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
        description: 'Natural high-density felt desk pad with anti-slip natural rubber backing for superior desk protection and gliding.',
        features: ['Genuine Felted Wool', 'Non-Slip Eco Rubber Base', 'Anti-Fray Stitched Edges', 'Sound Dampening'],
        inStock: true
      }
    ]
  }
];

/**
 * Resolves tenant configuration by hostname.
 * Supports query parameter (?tenant=...) override for developer local testing convenience.
 * 
 * @param {string} hostname - Domain or hostname (e.g. window.location.hostname)
 * @returns {object} Resolved tenant or fallback not-found state
 */
export function resolveTenant(hostname) {
  if (!hostname || typeof hostname !== 'string') {
    return {
      isNotFound: true,
      hostname: 'unknown',
      message: 'Invalid hostname provided.'
    };
  }

  // Strip port if present in hostname string
  const cleanHost = hostname.split(':')[0].trim().toLowerCase();

  // Allow explicit query parameter override for easy localhost previewing (?tenant=kopi-senja or ?tenant=techgear-store)
  if (typeof window !== 'undefined' && window.location) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tenantOverride = urlParams.get('tenant');
      if (tenantOverride) {
        const queryMatch = MOCK_TENANTS.find(
          (t) => t.tenantId.toLowerCase() === tenantOverride.toLowerCase() ||
                t.domain.toLowerCase() === tenantOverride.toLowerCase()
        );
        if (queryMatch) {
          return {
            ...queryMatch,
            isNotFound: false
          };
        }
      }
    } catch {
      // Fallback safely in non-browser or restricted context
    }
  }

  // Match against registered tenant domains
  const matched = MOCK_TENANTS.find((t) => t.domain.toLowerCase() === cleanHost);

  if (matched) {
    return {
      ...matched,
      isNotFound: false
    };
  }

  // Fallback state if store is not found
  return {
    isNotFound: true,
    hostname: cleanHost,
    message: `No active storefront configured for domain "${cleanHost}".`
  };
}
