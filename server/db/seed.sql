-- INSTACART development seed data

INSERT INTO categories (name, slug)
VALUES
    ('Fresh Produce', 'fresh-produce'),
    ('Dairy & Eggs', 'dairy-eggs'),
    ('Meat & Seafood', 'meat-seafood'),
    ('Pantry Staples', 'pantry-staples'),
    ('Bakery', 'bakery'),
    ('Frozen Foods', 'frozen-foods'),
    ('Snacks & Beverages', 'snacks-beverages'),
    ('Household', 'household')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

INSERT INTO products (category_id, name, slug, description, price, unit, image_url, stock_quantity)
SELECT categories.id, product_data.name, product_data.slug, product_data.description,
       product_data.price, product_data.unit, product_data.image_url, product_data.stock_quantity
FROM (
    VALUES
        ('fresh-produce', 'Organic Bananas', 'organic-bananas', 'Naturally sweet organic bananas.', 60.00::NUMERIC, '1 dozen', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80', 80),
        ('fresh-produce', 'Honeycrisp Apples', 'honeycrisp-apples', 'Crisp, sweet Honeycrisp apples.', 150.00::NUMERIC, '1 kg', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80', 45),
        ('fresh-produce', 'Baby Spinach', 'baby-spinach', 'Tender pre-washed baby spinach leaves.', 35.00::NUMERIC, '250g bunch', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80', 60),
        ('fresh-produce', 'Roma Tomatoes', 'roma-tomatoes', 'Firm tomatoes, ideal for sauces and salads.', 40.00::NUMERIC, '1 kg', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80', 50),
        ('fresh-produce', 'Hass Avocados', 'hass-avocados', 'Creamy ripe Hass avocados.', 180.00::NUMERIC, '2 pack', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=80', 35),
        ('dairy-eggs', 'Organic Whole Milk', 'organic-whole-milk', 'Rich organic whole milk.', 68.00::NUMERIC, '1 litre', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80', 40),
        ('dairy-eggs', 'Large Brown Eggs', 'large-brown-eggs', 'Free-range large brown eggs.', 95.00::NUMERIC, '12 count', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80', 55),
        ('dairy-eggs', 'Sharp Cheddar Cheese', 'sharp-cheddar-cheese', 'Aged sharp cheddar cheese.', 140.00::NUMERIC, '200g block', 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=80', 42),
        ('dairy-eggs', 'Plain Greek Yogurt', 'plain-greek-yogurt', 'Creamy high-protein plain Greek yogurt.', 85.00::NUMERIC, '400g tub', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80', 38),
        ('dairy-eggs', 'Salted Butter', 'salted-butter', 'Creamy salted sweet cream butter.', 58.00::NUMERIC, '100g pack', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80', 48),
        ('meat-seafood', 'Boneless Chicken Breast', 'boneless-chicken-breast', 'Lean boneless, skinless chicken breasts.', 260.00::NUMERIC, '1 kg', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80', 30),
        ('meat-seafood', 'Ground Beef 90% Lean', 'ground-beef-90-lean', 'Fresh lean ground beef.', 320.00::NUMERIC, '500g pack', 'https://images.unsplash.com/photo-1588347818036-558601350947?w=500&auto=format&fit=crop&q=80', 34),
        ('meat-seafood', 'Atlantic Salmon Fillet', 'atlantic-salmon-fillet', 'Fresh boneless Atlantic salmon fillet.', 490.00::NUMERIC, '500g', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80', 22),
        ('meat-seafood', 'Turkey Deli Slices', 'turkey-deli-slices', 'Oven-roasted sliced turkey breast.', 210.00::NUMERIC, '250g pack', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80', 36),
        ('meat-seafood', 'Italian Sausage', 'italian-sausage', 'Mild Italian pork sausage links.', 240.00::NUMERIC, '400g pack', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80', 28),
        ('pantry-staples', 'Jasmine Rice', 'jasmine-rice', 'Fragrant long-grain jasmine rice.', 130.00::NUMERIC, '1 kg bag', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80', 44),
        ('pantry-staples', 'Spaghetti Pasta', 'spaghetti-pasta', 'Durum wheat spaghetti.', 85.00::NUMERIC, '500g box', 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500&auto=format&fit=crop&q=80', 90),
        ('pantry-staples', 'Extra Virgin Olive Oil', 'extra-virgin-olive-oil', 'Cold-pressed extra virgin olive oil.', 450.00::NUMERIC, '500 ml', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80', 32),
        ('pantry-staples', 'Black Beans', 'black-beans', 'Canned black beans with no added salt.', 65.00::NUMERIC, '400g can', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80', 100),
        ('pantry-staples', 'Peanut Butter', 'peanut-butter', 'Creamy roasted peanut butter.', 160.00::NUMERIC, '350g jar', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=80', 52),
        ('bakery', 'Sourdough Bread', 'sourdough-bread', 'Crusty artisan sourdough loaf.', 75.00::NUMERIC, '400g loaf', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80', 25),
        ('bakery', 'Everything Bagels', 'everything-bagels', 'Fresh baked everything bagels.', 90.00::NUMERIC, '4 count', 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&auto=format&fit=crop&q=80', 30),
        ('bakery', 'Chocolate Chip Cookies', 'chocolate-chip-cookies', 'Soft baked cookies with chocolate chips.', 60.00::NUMERIC, '200g pack', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80', 35),
        ('bakery', 'Flour Tortillas', 'flour-tortillas', 'Soft flour tortillas for wraps and tacos.', 80.00::NUMERIC, '8 count', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80', 46),
        ('bakery', 'Blueberry Muffins', 'blueberry-muffins', 'Moist muffins filled with blueberries.', 110.00::NUMERIC, '4 count', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=80', 24),
        ('frozen-foods', 'Frozen Peas', 'frozen-peas', 'Sweet garden peas frozen at peak freshness.', 65.00::NUMERIC, '500g bag', 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&auto=format&fit=crop&q=80', 60),
        ('frozen-foods', 'Cheese Pizza', 'cheese-pizza', 'Classic four-cheese frozen pizza.', 199.00::NUMERIC, 'regular pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80', 32),
        ('frozen-foods', 'Mixed Berries', 'mixed-berries', 'Frozen strawberries, blueberries, and raspberries.', 180.00::NUMERIC, '300g bag', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=500&auto=format&fit=crop&q=80', 40),
        ('frozen-foods', 'Chicken Nuggets', 'chicken-nuggets', 'Breaded white meat chicken nuggets.', 170.00::NUMERIC, '400g pack', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=80', 28),
        ('frozen-foods', 'Vanilla Ice Cream', 'vanilla-ice-cream', 'Classic creamy vanilla ice cream.', 140.00::NUMERIC, '700ml tub', 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=80', 36),
        ('snacks-beverages', 'Sparkling Water', 'sparkling-water', 'Refreshing assorted citrus sparkling water.', 50.00::NUMERIC, '750ml bottle', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80', 70),
        ('snacks-beverages', 'Medium Roast Coffee', 'medium-roast-coffee', 'Balanced medium roast ground coffee.', 250.00::NUMERIC, '250g bag', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80', 45),
        ('snacks-beverages', 'Sea Salt Potato Chips', 'sea-salt-potato-chips', 'Crisp potato chips with sea salt.', 30.00::NUMERIC, '100g bag', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80', 58),
        ('snacks-beverages', 'Granola Bars', 'granola-bars', 'Oats and honey granola bars.', 120.00::NUMERIC, '6 bars pack', 'https://images.unsplash.com/photo-1622484216850-4d436a5faeb0?w=500&auto=format&fit=crop&q=80', 64),
        ('snacks-beverages', 'Orange Juice', 'orange-juice', 'Pulp-free orange juice from concentrate.', 95.00::NUMERIC, '1 litre', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=80', 42),
        ('household', 'Paper Towels', 'paper-towels', 'Absorbent two-ply paper towel rolls.', 110.00::NUMERIC, '2 rolls', 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&auto=format&fit=crop&q=80', 50),
        ('household', 'Free & Clear Laundry Detergent', 'free-clear-laundry-detergent', 'Fragrance-free liquid laundry detergent.', 220.00::NUMERIC, '1 litre', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80', 24),
        ('household', 'Dish Soap', 'dish-soap', 'Grease-cutting lemon dish soap.', 45.00::NUMERIC, '500ml bottle', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80', 48),
        ('household', 'All-Purpose Cleaner', 'all-purpose-cleaner', 'Multi-surface cleaner for everyday messes.', 99.00::NUMERIC, '500ml spray', 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&auto=format&fit=crop&q=80', 38),
        ('household', 'Kitchen Trash Bags', 'kitchen-trash-bags', 'Strong 13-gallon kitchen trash bags.', 85.00::NUMERIC, '30 bags roll', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&auto=format&fit=crop&q=80', 34)
) AS product_data(category_slug, name, slug, description, price, unit, image_url, stock_quantity)
JOIN categories ON categories.slug = product_data.category_slug
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    unit = EXCLUDED.unit,
    image_url = EXCLUDED.image_url,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();
