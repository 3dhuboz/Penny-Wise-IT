type TokenGetter = () => Promise<string | null>;

let getAuthToken: TokenGetter = async () => null;

export function setAuthTokenGetter(fn: TokenGetter) {
  getAuthToken = fn;
}

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(path, { ...options, headers });
}

// -- Clips --

export interface ClipData {
  id: string;
  title: string;
  description: string | null;
  r2_key: string;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  mime_type: string;
  status: string;
  created_at: string;
}

export interface ClientData {
  id: string;
  staff_id: string;
  company_name: string | null;
  contact_name: string;
  contact_email: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

export interface HandoverData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  magic_token: string;
  client_name: string;
  client_email: string;
  company_name: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface HandoverClipData {
  id: string;
  clip_id: string;
  position: number;
  chapter_title: string | null;
  clip_title: string;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  r2_key: string;
  mime_type: string;
}

export interface HandoverDetail {
  handover: HandoverData;
  clips: HandoverClipData[];
  acknowledgment: {
    id: string;
    client_name: string;
    client_email: string;
    acknowledged_at: string;
  } | null;
  emails: { id: string; status: string; sent_at: string; recipient_email: string }[];
  reminders: { id: string; reminder_number: number; sent_at: string }[];
}

export const api = {
  // Clips
  async listClips() {
    const res = await authFetch('/api/clips');
    if (!res.ok) throw new Error('Failed to fetch clips');
    return res.json() as Promise<{ clips: ClipData[] }>;
  },

  async deleteClip(id: string) {
    const res = await authFetch(`/api/clips/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete clip');
    return res.json() as Promise<{ ok: boolean }>;
  },

  uploadClip(
    file: File,
    title: string,
    onProgress?: (percent: number) => void
  ): { promise: Promise<{ id: string; r2Key: string; title: string }>; abort: () => void } {
    const xhr = new XMLHttpRequest();
    const promise = new Promise<{ id: string; r2Key: string; title: string }>(
      async (resolve, reject) => {
        const token = await getAuthToken();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        xhr.open('POST', '/api/clips/upload');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
      }
    );

    return { promise, abort: () => xhr.abort() };
  },

  // Clients
  async listClients() {
    const res = await authFetch('/api/clients');
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json() as Promise<{ clients: ClientData[] }>;
  },

  async createClient(data: { contact_name: string; contact_email: string; company_name?: string; phone?: string; notes?: string }) {
    const res = await authFetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create client');
    return res.json() as Promise<{ id: string }>;
  },

  async updateClient(id: string, data: Partial<{ contact_name: string; contact_email: string; company_name: string; phone: string; notes: string }>) {
    const res = await authFetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update client');
    return res.json() as Promise<{ ok: boolean }>;
  },

  async deleteClient(id: string) {
    const res = await authFetch(`/api/clients/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete client');
    return res.json() as Promise<{ ok: boolean }>;
  },

  // Handovers
  async listHandovers() {
    const res = await authFetch('/api/handovers');
    if (!res.ok) throw new Error('Failed to fetch handovers');
    return res.json() as Promise<{ handovers: HandoverData[] }>;
  },

  async getHandover(id: string) {
    const res = await authFetch(`/api/handovers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch handover');
    return res.json() as Promise<HandoverDetail>;
  },

  async createHandover(data: {
    title: string;
    client_id: string;
    description?: string;
    clip_ids?: { clip_id: string; chapter_title?: string }[];
    expires_at?: string;
  }) {
    const res = await authFetch('/api/handovers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create handover');
    return res.json() as Promise<{ id: string; magic_token: string }>;
  },

  async updateHandover(id: string, data: {
    title?: string;
    description?: string;
    clip_ids?: { clip_id: string; chapter_title?: string }[];
    expires_at?: string;
  }) {
    const res = await authFetch(`/api/handovers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update handover');
    return res.json() as Promise<{ ok: boolean }>;
  },

  async deleteHandover(id: string) {
    const res = await authFetch(`/api/handovers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete handover');
    return res.json() as Promise<{ ok: boolean }>;
  },

  async sendHandover(id: string) {
    const res = await authFetch(`/api/handovers/${id}/send`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json() as { error: string };
      throw new Error(err.error || 'Failed to send handover');
    }
    return res.json() as Promise<{ ok: boolean; viewer_url: string }>;
  },

  async sendReminder(id: string) {
    const res = await authFetch(`/api/handovers/${id}/remind`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json() as { error: string };
      throw new Error(err.error || 'Failed to send reminder');
    }
    return res.json() as Promise<{ ok: boolean; reminder_number: number }>;
  },
};

// Public viewer API (no auth)
export const viewerApi = {
  async getHandover(token: string) {
    const res = await fetch(`/api/view/${token}`);
    if (!res.ok) throw new Error('Failed to load handover');
    return res.json() as Promise<{
      handover: { id: string; title: string; description: string | null; staff_name: string; ai_summary: string | null };
      clips: { id: string; clip_id: string; position: number; chapter_title: string | null; clip_title: string; duration_seconds: number | null; mime_type: string }[];
      acknowledged: boolean;
    }>;
  },

  clipStreamUrl(token: string, clipId: string) {
    return `/api/view/${token}/clip/${clipId}/stream`;
  },

  async acknowledge(token: string, data: {
    client_name: string;
    client_email: string;
    consent_text: string;
    signature_data?: string;
  }) {
    const res = await fetch(`/api/view/${token}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string };
      throw new Error(err.error || 'Failed to submit acknowledgment');
    }
    return res.json() as Promise<{ ok: boolean; acknowledgment_id: string }>;
  },
};
