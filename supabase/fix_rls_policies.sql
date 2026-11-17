-- ══════════════════════════════════════════════════════════════════════
-- FIX RLS POLICIES FOR DISPATCH & ADMIN DASHBOARD
-- قم بنسخ هذا الكود وتشغيله في Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════════

-- 1. السماح للوحة التحكم بقراءة واستعراض كافة طلبات الركوب
DROP POLICY IF EXISTS "Customers view own orders" ON public.booking_orders;
DROP POLICY IF EXISTS "Allow dispatch read orders" ON public.booking_orders;

CREATE POLICY "Allow dispatch read orders" ON public.booking_orders
    FOR SELECT TO anon, authenticated USING (true);

-- 2. السماح بتحديث حالات الطلبات وتعيين السائقين
DROP POLICY IF EXISTS "Allow dispatch update orders" ON public.booking_orders;
CREATE POLICY "Allow dispatch update orders" ON public.booking_orders
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- 3. السماح بحذف الطلبات من الإدارة
DROP POLICY IF EXISTS "Allow dispatch delete orders" ON public.booking_orders;
CREATE POLICY "Allow dispatch delete orders" ON public.booking_orders
    FOR DELETE TO anon, authenticated USING (true);

-- 4. السماح بإدراج الحجوزات للجميع (زوار وعملاء مسجلين)
DROP POLICY IF EXISTS "Anyone can book a ride" ON public.booking_orders;
CREATE POLICY "Anyone can book a ride" ON public.booking_orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 5. السماح بقراءة وتحديث السائقين
DROP POLICY IF EXISTS "Authenticated read drivers" ON public.drivers;
DROP POLICY IF EXISTS "Allow read drivers" ON public.drivers;
CREATE POLICY "Allow read drivers" ON public.drivers
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow update drivers" ON public.drivers;
CREATE POLICY "Allow update drivers" ON public.drivers
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 6. السماح للوحة الإدارة بقراءة وتحديث رسائل التواصل
DROP POLICY IF EXISTS "Allow read contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow read contact inquiries" ON public.contact_inquiries
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow update contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow update contact inquiries" ON public.contact_inquiries
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- 7. تفعيل ميزة التحديث اللحظي (Realtime) لجدول الحجوزات
ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_orders;

