-- Clear out old broken products
DELETE FROM public.products;

-- Insert exactly 4 beautiful mock products perfectly formatted
INSERT INTO public.products (name, price, description, story, image, artisan_name, artisan_location, craft_process, category)
VALUES
  ('Handcrafted Sunflower Keychain', 30, 'A beautiful hand-knitted sunflower keychain.', 'Created exploring creative passions.', '/sunflower_keychain.png', 'Varsha', 'Airoli', 'Handcrafted with yarn.', 'Decor'),
  ('Miniature Canvas Painting', 50, 'A lovely mini frame painting.', 'Painted by traditional artists.', '/miniature_canvas_painting.png', 'Suresh', 'Pune', 'Acrylics on mini canvas.', 'Decor'),
  ('Terracotta Diya Set', 45, 'Set of two clay diyas.', 'Generations of potters.', '/terracotta_diya_set.png', 'Ramesh', 'Kutch', 'Molded and baked.', 'Pottery'),
  ('Handmade Paper Bookmark', 20, 'Floral pressed paper bookmark.', 'Upcycled waste paper.', '/handmade_paper_bookmark.png', 'Priya', 'Bengaluru', 'Infused with dry petals.', 'Stationery');