import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle, Shield, Search, Trash } from 'lucide-react';

interface UserProfile {
  user_id: string;
  full_name: string;
  username: string;
  user_type: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  photo_url: string;
}

const AdminManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    loadUsers();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      toast.error('Admin access required');
      navigate('/');
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;
      toast.success(`User ${!currentStatus ? 'verified' : 'unverified'} successfully`);
      loadUsers();
    } catch (error: any) {
      toast.error('Failed to update verification status');
    }
  };

  const toggleActiveStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      loadUsers();
    } catch (error: any) {
      toast.error('Failed to update active status');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) return;

    try {
      // Delete from auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete user');

      toast.success('User deleted successfully');
      loadUsers();
    } catch (error: any) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <div className="text-foreground/60">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-16">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.user_id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={user.photo_url || 'https://via.placeholder.com/100'}
                    alt={user.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{user.full_name}</h3>
                      {user.is_verified && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant={user.is_active ? "default" : "destructive"}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{user.user_type}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleVerification(user.user_id, user.is_verified)}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        {user.is_verified ? 'Remove Verification' : 'Verify User'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActiveStatus(user.user_id, user.is_active)}
                      >
                        {user.is_active ? <XCircle className="h-4 w-4 mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteUser(user.user_id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No users found</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminManageUsers;
