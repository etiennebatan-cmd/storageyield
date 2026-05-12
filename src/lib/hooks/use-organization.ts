'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';

interface Organization {
  id: string;
  name: string;
  owner_user_id: string;
}

export function useOrganization() {
  const [org, setOrg] = useState<Organization | null>(null);

  useEffect(() => {
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
  }, []);

  return org;
}
