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

INSERT INTO products (category_id, name, slug, description, price, unit, stock_quantity)
SELECT categories.id, product_data.name, product_data.slug, product_data.description,
       product_data.price, product_data.unit, product_data.stock_quantity
FROM (
    VALUES
        ('fresh-produce', 'Organic Bananas', 'organic-bananas', 'Naturally sweet organic bananas.', 1.99::NUMERIC, 'bunch', 80),
        ('fresh-produce', 'Honeycrisp Apples', 'honeycrisp-apples', 'Crisp, sweet Honeycrisp apples.', 4.49::NUMERIC, '3 lb bag', 45),
        ('fresh-produce', 'Baby Spinach', 'baby-spinach', 'Tender pre-washed baby spinach leaves.', 3.29::NUMERIC, '5 oz bag', 60),
        ('fresh-produce', 'Roma Tomatoes', 'roma-tomatoes', 'Firm tomatoes, ideal for sauces and salads.', 2.49::NUMERIC, '2 lb pack', 50),
        ('fresh-produce', 'Hass Avocados', 'hass-avocados', 'Creamy ripe Hass avocados.', 5.99::NUMERIC, '4 count', 35),
        ('dairy-eggs', 'Organic Whole Milk', 'organic-whole-milk', 'Rich organic whole milk.', 5.49::NUMERIC, '1 gallon', 40),
        ('dairy-eggs', 'Large Brown Eggs', 'large-brown-eggs', 'Free-range large brown eggs.', 4.99::NUMERIC, '12 count', 55),
        ('dairy-eggs', 'Sharp Cheddar Cheese', 'sharp-cheddar-cheese', 'Aged sharp cheddar cheese.', 4.79::NUMERIC, '8 oz block', 42),
        ('dairy-eggs', 'Plain Greek Yogurt', 'plain-greek-yogurt', 'Creamy high-protein plain Greek yogurt.', 5.29::NUMERIC, '32 oz tub', 38),
        ('dairy-eggs', 'Salted Butter', 'salted-butter', 'Creamy salted sweet cream butter.', 4.49::NUMERIC, '1 lb pack', 48),
        ('meat-seafood', 'Boneless Chicken Breast', 'boneless-chicken-breast', 'Lean boneless, skinless chicken breasts.', 8.99::NUMERIC, 'per lb', 30),
        ('meat-seafood', 'Ground Beef 90% Lean', 'ground-beef-90-lean', 'Fresh lean ground beef.', 7.49::NUMERIC, '1 lb pack', 34),
        ('meat-seafood', 'Atlantic Salmon Fillet', 'atlantic-salmon-fillet', 'Fresh boneless Atlantic salmon fillet.', 12.99::NUMERIC, 'per lb', 22),
        ('meat-seafood', 'Turkey Deli Slices', 'turkey-deli-slices', 'Oven-roasted sliced turkey breast.', 6.99::NUMERIC, '8 oz pack', 36),
        ('meat-seafood', 'Italian Sausage', 'italian-sausage', 'Mild Italian pork sausage links.', 6.49::NUMERIC, '1 lb pack', 28),
        ('pantry-staples', 'Jasmine Rice', 'jasmine-rice', 'Fragrant long-grain jasmine rice.', 7.99::NUMERIC, '5 lb bag', 44),
        ('pantry-staples', 'Spaghetti Pasta', 'spaghetti-pasta', 'Durum wheat spaghetti.', 1.79::NUMERIC, '16 oz box', 90),
        ('pantry-staples', 'Extra Virgin Olive Oil', 'extra-virgin-olive-oil', 'Cold-pressed extra virgin olive oil.', 11.99::NUMERIC, '17 oz bottle', 32),
        ('pantry-staples', 'Black Beans', 'black-beans', 'Canned black beans with no added salt.', 1.29::NUMERIC, '15 oz can', 100),
        ('pantry-staples', 'Peanut Butter', 'peanut-butter', 'Creamy roasted peanut butter.', 4.99::NUMERIC, '16 oz jar', 52),
        ('bakery', 'Sourdough Bread', 'sourdough-bread', 'Crusty artisan sourdough loaf.', 5.49::NUMERIC, 'loaf', 25),
        ('bakery', 'Everything Bagels', 'everything-bagels', 'Fresh baked everything bagels.', 4.49::NUMERIC, '6 count', 30),
        ('bakery', 'Chocolate Chip Cookies', 'chocolate-chip-cookies', 'Soft baked cookies with chocolate chips.', 4.99::NUMERIC, '12 oz pack', 35),
        ('bakery', 'Flour Tortillas', 'flour-tortillas', 'Soft flour tortillas for wraps and tacos.', 3.49::NUMERIC, '10 count', 46),
        ('bakery', 'Blueberry Muffins', 'blueberry-muffins', 'Moist muffins filled with blueberries.', 5.99::NUMERIC, '4 count', 24),
        ('frozen-foods', 'Frozen Peas', 'frozen-peas', 'Sweet garden peas frozen at peak freshness.', 2.49::NUMERIC, '16 oz bag', 60),
        ('frozen-foods', 'Cheese Pizza', 'cheese-pizza', 'Classic four-cheese frozen pizza.', 6.99::NUMERIC, '18 oz pizza', 32),
        ('frozen-foods', 'Mixed Berries', 'mixed-berries', 'Frozen strawberries, blueberries, and raspberries.', 8.49::NUMERIC, '24 oz bag', 40),
        ('frozen-foods', 'Chicken Nuggets', 'chicken-nuggets', 'Breaded white meat chicken nuggets.', 7.99::NUMERIC, '24 oz bag', 28),
        ('frozen-foods', 'Vanilla Ice Cream', 'vanilla-ice-cream', 'Classic creamy vanilla ice cream.', 5.99::NUMERIC, '48 oz tub', 36),
        ('snacks-beverages', 'Sparkling Water', 'sparkling-water', 'Refreshing assorted citrus sparkling water.', 4.99::NUMERIC, '12 pack', 70),
        ('snacks-beverages', 'Medium Roast Coffee', 'medium-roast-coffee', 'Balanced medium roast ground coffee.', 9.99::NUMERIC, '12 oz bag', 45),
        ('snacks-beverages', 'Sea Salt Potato Chips', 'sea-salt-potato-chips', 'Crisp potato chips with sea salt.', 4.49::NUMERIC, '8 oz bag', 58),
        ('snacks-beverages', 'Granola Bars', 'granola-bars', 'Oats and honey granola bars.', 5.49::NUMERIC, '6 count', 64),
        ('snacks-beverages', 'Orange Juice', 'orange-juice', 'Pulp-free orange juice from concentrate.', 4.99::NUMERIC, '52 oz carton', 42),
        ('household', 'Paper Towels', 'paper-towels', 'Absorbent two-ply paper towel rolls.', 12.99::NUMERIC, '6 rolls', 50),
        ('household', 'Free & Clear Laundry Detergent', 'free-clear-laundry-detergent', 'Fragrance-free liquid laundry detergent.', 13.49::NUMERIC, '100 oz bottle', 24),
        ('household', 'Dish Soap', 'dish-soap', 'Grease-cutting lemon dish soap.', 3.99::NUMERIC, '24 oz bottle', 48),
        ('household', 'All-Purpose Cleaner', 'all-purpose-cleaner', 'Multi-surface cleaner for everyday messes.', 4.49::NUMERIC, '32 oz spray', 38),
        ('household', 'Kitchen Trash Bags', 'kitchen-trash-bags', 'Strong 13-gallon kitchen trash bags.', 9.99::NUMERIC, '40 count', 34)
) AS product_data(category_slug, name, slug, description, price, unit, stock_quantity)
JOIN categories ON categories.slug = product_data.category_slug
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    unit = EXCLUDED.unit,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();