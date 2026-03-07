import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Skip middleware if env vars are missing (prevents crash on deployment)
    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.next();
    }

    try {
        let supabaseResponse = NextResponse.next({ request });

        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        });

        const { data: { user } } = await supabase.auth.getUser();

        const publicRoutes = ['/login', '/signup', '/forgot-password', '/auth/callback', '/features', '/privacy-security', '/community'];
        const isPublicRoute = publicRoutes.some((route) =>
            request.nextUrl.pathname.startsWith(route)
        );
        const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

        if (!user && !isPublicRoute && request.nextUrl.pathname !== '/') {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        if (user && isPublicRoute) {
            const url = request.nextUrl.clone();
            url.pathname = '/feed';
            return NextResponse.redirect(url);
        }

        // Admin route protection: server-side role check
        if (isAdminRoute && user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (!profile || profile.role !== 'admin') {
                const url = request.nextUrl.clone();
                url.pathname = '/feed';
                return NextResponse.redirect(url);
            }
        }

        return supabaseResponse;
    } catch {
        // If middleware fails, let the request through rather than crashing
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
