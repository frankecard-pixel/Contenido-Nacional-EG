-- Insert default data into public web content tables

-- 1. Web FAQs
INSERT INTO public.web_faqs (question, answer, category) VALUES
('{"es": "¿Cómo registrarse?", "en": "How to register?", "fr": "Comment s''inscrire?"}', '{"es": "Haga clic en el botón de registro.", "en": "Click on the register button.", "fr": "Cliquez sur le bouton d''inscription."}', 'General'),
('{"es": "¿Es gratuito?", "en": "Is it free?", "fr": "Est-ce gratuit?"}', '{"es": "Sí, el portal es gratuito.", "en": "Yes, the portal is free.", "fr": "Oui, le portail est gratuit."}', 'General');

-- 2. Web Normativas
INSERT INTO public.web_normativas (title, description, file_url, category) VALUES
('{"es": "Ley de Hidrocarburos", "en": "Hydrocarbons Law", "fr": "Loi sur les hydrocarbures"}', '{"es": "Normativa sobre hidrocarburos.", "en": "Regulation on hydrocarbons.", "fr": "Réglementation sur les hydrocarbures."}', '#', 'Leyes'),
('{"es": "Guía de Contenido Nacional", "en": "Local Content Guide", "fr": "Guide du Contenu National"}', '{"es": "Guía sobre contenido nacional.", "en": "Guide on local content.", "fr": "Guide sur le contenu national."}', '#', 'Guías');

-- 3. Web Guides
INSERT INTO public.web_guides (title, description, file_url, category) VALUES
('{"es": "Manual del Usuario", "en": "User Manual", "fr": "Manuel de l''utilisateur"}', '{"es": "Cómo navegar por el portal.", "en": "How to navigate the portal.", "fr": "Comment naviguer sur le portail."}', '#', 'Guías de Usuario');

-- 4. Web Testimonials
INSERT INTO public.web_testimonials (name, company, role, quote, status) VALUES
('Juan Pérez', 'Empresa A', '{"es": "Gerente", "en": "Manager", "fr": "Gérant"}', '{"es": "Excelente portal.", "en": "Excellent portal.", "fr": "Excellent portail."}', 'published'),
('María García', 'Empresa B', '{"es": "Directora", "en": "Director", "fr": "Directrice"}', '{"es": "Muy útil.", "en": "Very useful.", "fr": "Très utile."}', 'published');

-- 5. Web Priority Sectors
INSERT INTO public.web_priority_sectors (title, description, icon) VALUES
('{"es": "Hidrocarburos", "en": "Hydrocarbons", "fr": "Hydrocarbures"}', '{"es": "Principal sector de exportación.", "en": "Main export sector.", "fr": "Principal secteur d''exportation."}', 'oil'),
('{"es": "Minería", "en": "Mining", "fr": "Mines"}', '{"es": "Desarrollo de recursos minerales.", "en": "Development of mineral resources.", "fr": "Développement des ressources minérales."}', 'diamond');


