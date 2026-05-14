'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

interface Organization {
  id: string;
  name: string;
  owner_user_id: string;
}

export function useOrganization() {
  const [org, setOrg] = useState<Organization | null>(null);
  const searchParams = useSearchParams();
  const isDemo = searchParams?.get('demo') === '1';

  useEffect(() => {
    if (isDemo) {
      // Return demo organization
      setOrg({
        id: 'demo-org',
        name: 'Demo Organization',
        owner_user_id: 'demo-user'
      });
      return;
    }

    async function loadOrg() {
      try {
        const { data } = await supabaseClient.auth.getSession();
        const session = data?.session;

        if (!session?.user?.id) {
          return;
        }

        const { data: membership } = await supabaseClient
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', session.user.id)
          .single();

        if (membership?.organization_id) {
          const { data: organization } = await supabaseClient
            .from('organizations')
            .select('*')
            .eq('id', membership.organization_id)
            .single();

          if (organization) {
            setOrg(organization);
          }
        }
      } catch (error) {
        console.error('Failed to load organization:', error);
      }
    }

    loadOrg();
  }, [isDemo]);

  return org;
}
