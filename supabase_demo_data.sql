-- SQL script to populate demo data for the Ministry Portal

-- 1. Insert Demo Users
-- Note: These IDs should match the IDs in auth.users if you want to link them.
-- For demo purposes, we insert them into public.users.
INSERT INTO public.users (id, email, name, role, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@ministerio.gq', 'Admin Principal', 'admin', 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'petrolera1@demo.com', 'Petrolera Demo S.A.', 'petrolera', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'empresa1@demo.com', 'Empresa Local S.L.', 'empresa', 'active');

-- 2. Insert Demo Companies
INSERT INTO public.companies (id, name, tax_id, ruge_id, type, sector, status, compliance_score, address, email) VALUES
(gen_random_uuid(), 'Petrolera Demo S.A.', 'TAX-123456', 'RUGE-001', 'Internacional', ARRAY['Exploración', 'Producción'], 'active', 95, 'Malabo, Guinea Ecuatorial', 'contacto@petrolera1.demo.com'),
(gen_random_uuid(), 'Empresa Local S.L.', 'TAX-654321', 'RUGE-002', 'Local', ARRAY['Logística', 'Servicios'], 'active', 88, 'Bata, Guinea Ecuatorial', 'info@empresalocal.demo.com');

-- 3. Insert Demo Opportunities
INSERT INTO public.opportunities (id, title, description, category, budget, deadline, status, petrolera_id, location, requirements, ref) VALUES
(gen_random_uuid(), '{"es": "Mantenimiento de Plataformas Offshore"}', '{"es": "Servicios de mantenimiento preventivo y correctivo para plataformas en el bloque B."}', 'Mantenimiento', 500000, '2026-12-31', 'published', '550e8400-e29b-41d4-a716-446655440001', 'Bloque B', ARRAY['Certificación ISO', 'Experiencia previa'], 'OPP-2026-001'),
(gen_random_uuid(), '{"es": "Suministro de Tuberías de Acero"}', '{"es": "Provisión de tuberías de alta resistencia para proyectos de expansión."}', 'Suministros', 250000, '2026-11-15', 'published', '550e8400-e29b-41d4-a716-446655440001', 'Malabo', ARRAY['Certificación de calidad', 'Capacidad logística'], 'OPP-2026-002');

-- 4. Insert Demo News Articles
INSERT INTO public.news_articles (id, title, summary, content, category, status, author, publish_date) VALUES
(gen_random_uuid(), '{"es": "Nuevo récord de producción nacional"}', '{"es": "El sector hidrocarburos alcanza cifras históricas."}', '{"es": "El Ministerio de Hidrocarburos anuncia..."}', 'Transparencia', 'published', 'Ministerio', now()),
(gen_random_uuid(), '{"es": "Firma de acuerdo de contenido local"}', '{"es": "Más empresas locales se integran a la cadena de valor."}', '{"es": "Se ha firmado un convenio para..."}', 'Contenido Nacional', 'published', 'Ministerio', now());

-- 5. Insert Demo Social Projects
INSERT INTO public.social_projects (id, title, description, impact, location, petrolera_id, status, budget, progress) VALUES
(gen_random_uuid(), '{"es": "Escuela Técnica en Bata"}', '{"es": "Construcción de centro de formación técnica."}', 'Educación', 'Bata', '550e8400-e29b-41d4-a716-446655440001', 'active', 100000, 75);
