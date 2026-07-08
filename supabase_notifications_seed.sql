-- ====================================================================
-- SCRIPT DE INSERCIÓN DE DATOS PARA NOTIFICACIONES REALES EN SUPABASE
-- ====================================================================
-- Este script inserta datos de prueba reales para la tabla public.notifications
-- vinculándolos con los usuarios existentes en tu base de datos de Supabase.
-- Puedes copiar y ejecutar este código directamente en el SQL Editor de Supabase.

-- OPCIÓN A: Inserción automática y dinámica para TODOS los usuarios actuales
-- Este bloque PL/pgSQL detecta los usuarios de public.users y les genera
-- un set completo de notificaciones adaptadas.
DO $$
DECLARE
    v_user_record RECORD;
    v_notif_count INTEGER;
BEGIN
    -- Recorremos cada usuario en la tabla public.users
    FOR v_user_record IN SELECT id, name, role FROM public.users LOOP
        
        -- Verificamos si el usuario ya tiene notificaciones para no duplicar
        SELECT COUNT(*) INTO v_notif_count FROM public.notifications WHERE user_id = v_user_record.id;
        
        IF v_notif_count = 0 THEN
            -- 1. Notificación del sistema de Bienvenida (Leída)
            INSERT INTO public.notifications (id, user_id, title, content, read, created_at)
            VALUES (
                gen_random_uuid(),
                v_user_record.id,
                'Bienvenido al Portal de Contenido Nacional',
                'Hola ' || v_user_record.name || ', su cuenta ha sido configurada correctamente en el portal oficial del Ministerio de Hidrocarburos.',
                true,
                now() - INTERVAL '3 days'
            );

            -- 2. Notificación de Licitación / Oportunidad (No leída)
            INSERT INTO public.notifications (id, user_id, title, content, read, created_at)
            VALUES (
                gen_random_uuid(),
                v_user_record.id,
                'Nueva Licitación: Suministro de Equipamiento Mecánico',
                'Marathon Oil ha publicado una nueva oportunidad de licitación en el sector de Suministros. El plazo de presentación expira pronto.',
                false,
                now() - INTERVAL '1 day'
            );

            -- 3. Notificación de cumplimiento / estado (No leída)
            INSERT INTO public.notifications (id, user_id, title, content, read, created_at)
            VALUES (
                gen_random_uuid(),
                v_user_record.id,
                'Certificado de Registro de Contenido Nacional Emitido',
                'El Ministerio ha completado la auditoría anual y se ha generado su Certificado de Contenido Nacional con calificación de excelente cumplimiento.',
                false,
                now() - INTERVAL '2 hours'
            );

            -- 4. Notificación de soporte / consultas (Leída)
            INSERT INTO public.notifications (id, user_id, title, content, read, created_at)
            VALUES (
                gen_random_uuid(),
                v_user_record.id,
                'Respuesta a su solicitud de soporte',
                'Un inspector del Ministerio ha respondido a su consulta técnica sobre el Registro Único de Empresas (RUGE).',
                true,
                now() - INTERVAL '5 hours'
            );
        END IF;
        
    END LOOP;
END $$;


-- OPCIÓN B: Inserciones manuales con IDs específicos
-- Si deseas insertar una notificación para un usuario concreto, reemplaza 'TU_USER_UUID'
-- con el UUID real del usuario de la tabla public.users:

/*
INSERT INTO public.notifications (id, user_id, title, content, read, created_at)
VALUES 
(
  gen_random_uuid(), 
  'TU_USER_UUID', -- Reemplazar con el UUID del usuario
  'Actualización Importante de Normativa', 
  'Se ha publicado la nueva Guía de Procedimiento para la Subcontratación de Empresas de Guinea Ecuatorial.', 
  false, 
  now()
);
*/
