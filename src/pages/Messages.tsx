import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: { full_name: string; photo_url?: string };
  recipient?: { full_name: string; photo_url?: string };
}

interface Conversation {
  userId: string;
  userName: string;
  userPhoto?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadMessages();
      setupRealtime();
    }
  }, [currentUser]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadMessages = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, photo_url),
          recipient:profiles!messages_recipient_id_fkey(full_name, photo_url)
        `)
        .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
      buildConversations(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const buildConversations = (msgs: Message[]) => {
    const convMap = new Map<string, Conversation>();

    msgs.forEach(msg => {
      const otherUserId = msg.sender_id === currentUser.id ? msg.recipient_id : msg.sender_id;
      const otherUser = msg.sender_id === currentUser.id ? msg.recipient : msg.sender;

      if (!convMap.has(otherUserId)) {
        convMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUser?.full_name || 'Unknown User',
          userPhoto: otherUser?.photo_url,
          lastMessage: msg.content,
          lastMessageTime: msg.created_at,
          unreadCount: 0
        });
      }

      if (!msg.is_read && msg.recipient_id === currentUser.id) {
        const conv = convMap.get(otherUserId)!;
        conv.unreadCount++;
      }
    });

    setConversations(Array.from(convMap.values()));
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => loadMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: currentUser.id,
        recipient_id: selectedConversation,
        content: newMessage.trim()
      });

      if (error) throw error;

      setNewMessage('');
      toast({ title: 'Message sent successfully' });
    } catch (error) {
      toast({ title: 'Error sending message', variant: 'destructive' });
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const selectedMessages = messages.filter(
    m => (m.sender_id === selectedConversation || m.recipient_id === selectedConversation)
  );

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view messages</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gradient-primary">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Conversations
              </CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {conversations
                  .filter(c => c.userName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(conv => (
                    <div
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv.userId)}
                      className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                        selectedConversation === conv.userId ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={conv.userPhoto} />
                          <AvatarFallback>{conv.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold truncate">{conv.userName}</p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader>
                  <CardTitle>
                    {conversations.find(c => c.userId === selectedConversation)?.userName || 'Conversation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] mb-4">
                    <div className="space-y-4">
                      {selectedMessages.reverse().map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.sender_id === currentUser.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(msg.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      rows={2}
                    />
                    <Button onClick={sendMessage} size="icon" className="self-end">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
