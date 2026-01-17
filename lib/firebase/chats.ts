import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getDoc,
  setDoc,
} from "firebase/firestore"
import { db } from "./firebase"

interface messageDataType {
  id?: string,
  message: string,
  senderId: string,
  createdAt: any,
  image: null | string,
  read: boolean,
}

export type MessageDataType = messageDataType

export interface ChatMessage {
  chatId: string
  participants: {
    [id: string]: {
      name: string,
      image: string,
    }
  }
  productData: {
    productId: string,
    productImage: string,
    productPrice: string | number,
    productName: string,
  }
  messages: messageDataType[]
}

export interface ChatListDataType {
  id?: string
  chatId?: string
  timeStamp: any
  productName: string
  productImage?: string
  productPrice?: string | number
  productId?: string
  message: {
    senderId: string,
    text: string,
  }
  participants: {
    [id: string]: {
      name: string
      id: string
      image: string
    }
  }
  unreadCount: {
    [id: string]: number
  }
}

// // Create a new chat or get existing chat for a product
// export const createOrGetChat = async (
//   productId: string,
//   productName: string,
//   productPrice: number,
//   productImage: string,
//   buyerId: string,
//   buyerName: string,
//   sellerId: string,
//   sellerName: string,
//   buyerAvatar?: string,
//   sellerAvatar?: string,
// ): Promise<string> => {
//   try {
//     // Validate that buyer and seller are different
//     if (buyerId === sellerId) {
//       throw new Error("Cannot create chat with yourself")
//     }

//     // Check if chat already exists between these users for this specific product
//     const chatsQuery = query(
//       collection(db, "chatList"),
//       where("productId", "==", productId),
//       where("buyerId", "==", buyerId),
//       where("sellerId", "==", sellerId),
//     )

//     const existingChats = await getDocs(chatsQuery)

//     if (!existingChats.empty) {
//       // Return existing chat ID for this product
//       console.log("Found existing chat for product:", productId)
//       return existingChats.docs[0].id
//     }

//     // Create new chat for this specific product
//     const chatData: Omit<Chat, "id"> = {
//       productId,
//       productName: productName || "Unknown Product",
//       productPrice: productPrice || 0,
//       productImage: productImage || "/user_placeholder.png",
//       buyerId,
//       buyerName: buyerName || "Anonymous Buyer",
//       buyerAvatar,
//       sellerId,
//       sellerName: sellerName || "Anonymous Seller",
//       sellerAvatar,
//       lastMessage: "",
//       lastMessageTime: serverTimestamp(),
//       unreadCount: {
//         [buyerId]: 0,
//         [sellerId]: 0,
//       },
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     }

//     console.log("Creating new chat for product:", productId)
//     const chatRef = await addDoc(collection(db, "chatList"), chatData)
//     return chatRef.id
//   } catch (error) {
//     console.error("Error creating/getting chat:", error)
//     throw new Error(`Failed to create chat: ${error instanceof Error ? error.message : "Unknown error"}`)
//   }
// }

// Send a message in a chat
export const sendMessage = async (
  chatId: string,
  senderId: string,
  senderName: string,
  text: string,
  receiverId: string,
  senderAvatar: string,
  productName: string,
  receiverName: string,
  receiverAvatar: string,
  productId: string,
  productImage: string,
  productPrice: string | number
): Promise<void> => {
  try {
    // Validate required parameters
    if (!chatId || !senderId || !text.trim() || !receiverId || !senderName || !productName || !receiverName) {
      throw new Error(`Missing required parameters for sending message: chatId=${chatId}, senderId=${senderId}, text=${text.trim()}, receiverId=${receiverId}, senderName=${senderName}, productName=${productName}, receiverName=${receiverName}`)
    }

    if (senderId === receiverId) {
      throw new Error("Cannot send message to yourself")
    }

    // Update chat with last message and increment unread count
    const chatRef = doc(db, "chatList", chatId)
    const chatDoc = await getDoc(chatRef)

    if (chatDoc.exists()) {
      const chatData = chatDoc.data() as ChatListDataType
      const newUnreadCount = { ...chatData.unreadCount }
      newUnreadCount[receiverId] = (newUnreadCount[receiverId] || 0) + 1

      await updateDoc(chatRef, {
        message: {
          senderId,
          text: text.trim(),
        },
        unreadCount: newUnreadCount,
        timeStamp: serverTimestamp(),
        productImage,
        productPrice,
        productId,
      });

      console.log("Updated chat with last message");

    } else {
      // creating new chatList
      const newChatListData = {
        chatId,
        timeStamp: serverTimestamp(),
        productName,
        productImage,
        productPrice,
        productId,
        message: {
          senderId,
          text: text.trim(),
        },
        participants: {
          [senderId]:{
            name: senderName,
            senderAvatar,
          },
          [receiverId]:{
            name: receiverName,
            receiverAvatar,
          }
        },
        unreadCount: {
          [receiverId]: 1,
          [senderId]: 0,
        }
      }

      console.log("new chat list data", newChatListData);
     
      await setDoc(doc(db, "chatList", chatId), newChatListData);
    }

    // Add message to subcollection (like mobile app)
    const messageData = {
      message: text.trim(),
      senderId,
      createdAt: new Date(),
      image: null,
      read: false,
    };

    await addDoc(collection(db, 'chats', chatId, 'messages'), messageData);
    console.log("Message added to subcollection");
  } catch (error) {
    console.error("Error sending message:", error)
    throw new Error(`Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Get chats for a user (only return chat list, not messages)
// export const getUserChats = async (userId: string): Promise<Chat[]> => {
//   try {
//     if (!userId) {
//       throw new Error("User ID is required")
//     }

//     // Get chats where user is buyer
//     const buyerChatsQuery = query(collection(db, "chatList"), where("buyerId", "==", userId), orderBy("updatedAt", "desc"))

//     // Get chats where user is seller
//     const sellerChatsQuery = query(
//       collection(db, "chatList"),
//       where("sellerId", "==", userId),
//       orderBy("updatedAt", "desc"),
//     )

//     const [buyerChats, sellerChats] = await Promise.all([getDocs(buyerChatsQuery), getDocs(sellerChatsQuery)])

//     const allChats: Chat[] = []

//     // Add buyer chats
//     buyerChats.docs.forEach((doc) => {
//       allChats.push({ id: doc.id, ...doc.data() } as Chat)
//     })

//     // Add seller chats (avoid duplicates)
//     sellerChats.docs.forEach((doc) => {
//       const chatData = { id: doc.id, ...doc.data() } as Chat
//       if (!allChats.find((chat) => chat.id === chatData.id)) {
//         allChats.push(chatData)
//       }
//     })

//     // Sort by last message time
//     return allChats.sort((a, b) => {
//       const aTime = a.lastMessageTime?.toDate() || new Date(0)
//       const bTime = b.lastMessageTime?.toDate() || new Date(0)
//       return bTime.getTime() - aTime.getTime()
//     })
//   } catch (error) {
//     console.error("Error getting user chats:", error)
//     return []
//   }
// }

// // Get messages for a specific chat
// export const getChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
//   try {
//     if (!chatId) {
//       throw new Error("Chat ID is required")
//     }

//     const messagesQuery = query(collection(db, "messages"), where("chatId", "==", chatId), orderBy("timestamp", "asc"))

//     const messagesSnapshot = await getDocs(messagesQuery)
//     return messagesSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as ChatMessage[]
//   } catch (error) {
//     console.error("Error getting chat messages:", error)
//     return []
//   }
// }

// // Subscribe to chat messages for a specific chat
export const subscribeToChatMessages = (chatId: string, callback: (messages: ChatMessage|null) => void): (() => void) => {
  if (!chatId) {
    console.error("Chat ID is required for subscription")
    return () => {}
  }

  // Query messages subcollection ordered by createdAt
  const messagesQuery = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(
    messagesQuery, 
    (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      console.log("Current messages: ", messagesList);
      
      const chatMessage: ChatMessage = {
        messages: messagesList as any
      };
      callback(chatMessage);
    },
    (error) => {
      console.error("Error in messages subscription:", error)
      callback(null)
    },
  );
}

// Helper to normalize legacy chat data to current format
const normalizeChatData = (
  doc: any,
  docId: string,
  vendorCache?: Map<string, any>
): ChatListDataType | null => {
  const data = doc;
  
  // Check if this is legacy format (participants is an array)
  if (Array.isArray(data.participants)) {
    // Legacy format from mobile app
    const [user1, user2] = data.participants;
    
    // Try to get names from various possible locations in the document
    const getParticipantName = (userId: string, index: number) => {
      // Check vendor cache first (fetched from vendors collection) - this has displayName
      if (vendorCache && vendorCache.has(userId)) {
        const vendorData = vendorCache.get(userId);
        return vendorData.displayName || vendorData.name || "User";
      }
      // Check if there's a participants map/object with names
      if (data.participants && !Array.isArray(data.participants) && data.participants[userId]?.name) {
        return data.participants[userId].name;
      }
      // Check if there's a participantNames object
      if (data.participantNames && data.participantNames[userId]) {
        return data.participantNames[userId];
      }
      // Check in a stored participants data structure
      if (data.participantsData && data.participantsData[userId]?.name) {
        return data.participantsData[userId].name;
      }
      // Check lastMessage for sender/receiver names
      if (data.lastMessage) {
        if (userId === data.lastMessage.senderId && data.lastMessage.senderName) {
          return data.lastMessage.senderName;
        }
        if (userId === data.lastMessage.receiverId && data.lastMessage.receiverName) {
          return data.lastMessage.receiverName;
        }
      }
      // Check messages array if it exists
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        const msg = data.messages[data.messages.length - 1]; // Get last message
        if (msg.participants && msg.participants[userId]?.name) {
          return msg.participants[userId].name;
        }
      }
      return "User";
    };
    
    const getParticipantImage = (userId: string) => {
      // Check vendor cache first for profile image (matches mobile: photoURL)
      if (vendorCache && vendorCache.has(userId)) {
        const vendorData = vendorCache.get(userId);
        return vendorData.photoURL || vendorData.profileImage || vendorData.image || "";
      }
      // Check if there's a participants map with image
      if (data.participants && !Array.isArray(data.participants) && data.participants[userId]?.image) {
        return data.participants[userId].image;
      }
      // Check if there's a participantImages object
      if (data.participantImages && data.participantImages[userId]) {
        return data.participantImages[userId];
      }
      // Check in stored participants data
      if (data.participantsData && data.participantsData[userId]?.image) {
        return data.participantsData[userId].image;
      }
      // Check lastMessage for avatars
      if (data.lastMessage) {
        if (userId === data.lastMessage.senderId && data.lastMessage.senderAvatar) {
          return data.lastMessage.senderAvatar;
        }
        if (userId === data.lastMessage.receiverId && data.lastMessage.receiverAvatar) {
          return data.lastMessage.receiverAvatar;
        }
      }
      // Check messages array
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        const msg = data.messages[data.messages.length - 1];
        if (msg.participants && msg.participants[userId]?.image) {
          return msg.participants[userId].image;
        }
      }
      return "";
    };
    
    return {
      id: docId,
      chatId: docId,
      timeStamp: data.lastMessage?.createdAt || data.createdAt || null,
      productName: data.productName || "Chat",
      productId: data.productId || "",
      productImage: data.productImage || "",
      productPrice: data.productPrice || 0,
      message: {
        senderId: data.lastMessage?.senderId || "",
        text: data.lastMessage?.message || data.lastMessage?.text || "",
      },
      participants: {
        [user1]: { 
          name: getParticipantName(user1, 0), 
          id: user1, 
          image: getParticipantImage(user1)
        },
        [user2]: { 
          name: getParticipantName(user2, 1), 
          id: user2, 
          image: getParticipantImage(user2)
        },
      },
      unreadCount: {
        [user1]: data.lastMessage?.read ? 0 : (data.lastMessage?.senderId === user2 ? 1 : 0),
        [user2]: data.lastMessage?.read ? 0 : (data.lastMessage?.senderId === user1 ? 1 : 0),
      },
    };
  }
  
  // Current web format (participants is a map)
  if (data.participants && typeof data.participants === 'object' && !Array.isArray(data.participants)) {
    // Extract participant info from the map
    const normalizedParticipants: Record<string, any> = {};
    for (const [userId, participantData] of Object.entries(data.participants)) {
      const pData = participantData as any;
      normalizedParticipants[userId] = {
        id: userId,
        name: pData?.name || pData?.displayName || "User",
        image: pData?.senderAvatar || pData?.receiverAvatar || pData?.photoURL || "",
      };
    }
    
    return {
      id: docId,
      chatId: data.chatId || docId,
      timeStamp: data.timeStamp || data.lastMessage?.createdAt || null,
      productName: data.productName || "Chat",
      productId: data.productId || "",
      productImage: data.productImage || "",
      productPrice: data.productPrice || 0,
      message: data.message || {
        senderId: data.lastMessage?.senderId || "",
        text: data.lastMessage?.message || data.lastMessage?.text || "",
      },
      participants: normalizedParticipants,
      unreadCount: data.unreadCount || {},
    };
  }
  
  return null;
};

// // Subscribe to user chats (only chat list, not messages)
export const subscribeToUserChats = (userId: string, callback: (chats: ChatListDataType[]) => void): (() => void) => {
  if (!userId) {
    console.error("User ID is required for subscription")
    return () => {}
  }
  
  // Store raw snapshot data to re-normalize when vendors load
  let chatListDocs: { data: any, id: string }[] = [];
  let legacyDocs: { data: any, id: string }[] = [];
  let chatListLoaded = false;
  let legacyChatsLoaded = false;
  let vendorsLoaded = false;
  
  // Cache for vendor data (userId -> vendor doc)
  const vendorCache = new Map<string, any>();
  
  const normalizeAndCallback = () => {
    // Only callback when all data is loaded
    if (!chatListLoaded || !legacyChatsLoaded || !vendorsLoaded) {
      return;
    }
    
    const allChats: ChatListDataType[] = [];
    
    // Normalize chatList docs
    chatListDocs.forEach(({ data, id }) => {
      const normalized = normalizeChatData(data, id, vendorCache);
      if (normalized && (
        Array.isArray(data.participants) 
          ? data.participants.includes(userId)
          : normalized.participants[userId]
      )) {
        allChats.push(normalized);
      }
    });
    
    // Normalize legacy docs
    legacyDocs.forEach(({ data, id }) => {
      if (Array.isArray(data.participants) && data.participants.includes(userId)) {
        const normalized = normalizeChatData(data, id, vendorCache);
        if (normalized && !allChats.find(c => c.id === normalized.id)) {
          allChats.push(normalized);
        }
      }
    });
    
    // Sort all chats by timestamp
    const sortedChats = [...allChats].sort((a, b) => {
      const aTime = a.timeStamp?.toDate?.() || a.timeStamp || new Date(0);
      const bTime = b.timeStamp?.toDate?.() || b.timeStamp || new Date(0);
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
    
    // Remove duplicates by id
    const uniqueChats = sortedChats.filter((chat, index, self) => 
      index === self.findIndex(c => c.id === chat.id)
    );
    
    callback(uniqueChats);
  };

  // Pre-fetch vendor data for common participants
  const preloadVendors = async () => {
    try {
      // Query all vendors to populate cache
      const vendorsSnapshot = await getDocs(collection(db, "vendors"));
      vendorsSnapshot.docs.forEach((doc) => {
        vendorCache.set(doc.id, doc.data());
      });
      vendorsLoaded = true;
      normalizeAndCallback();
    } catch (error) {
      console.error("Error preloading vendors:", error);
      vendorsLoaded = true;
      normalizeAndCallback();
    }
  };

  // Start preloading vendors
  preloadVendors();

  // Subscribe to new chatList collection
  const chatListQuery = query(collection(db, "chatList"), orderBy("timeStamp", "desc"));
  const unsubscribeChatList = onSnapshot(
    chatListQuery,
    (snapshot) => {
      // Store raw docs for later normalization
      chatListDocs = snapshot.docs.map(doc => ({ data: doc.data(), id: doc.id }));
      chatListLoaded = true;
      normalizeAndCallback();
    },
    (error) => {
      console.error("Error in chatList subscription:", error);
      chatListLoaded = true;
      normalizeAndCallback();
    }
  );

  // Subscribe to legacy "chats" collection
  const legacyChatsQuery = query(collection(db, "chats"));
  const unsubscribeLegacyChats = onSnapshot(
    legacyChatsQuery,
    (snapshot) => {
      // Store raw docs for later normalization
      legacyDocs = snapshot.docs.map(doc => ({ data: doc.data(), id: doc.id }));
      legacyChatsLoaded = true;
      normalizeAndCallback();
    },
    (error) => {
      console.error("Error in legacy chats subscription:", error);
      legacyChatsLoaded = true;
      normalizeAndCallback();
    }
  );

  // Return cleanup function
  return () => {
    unsubscribeChatList();
    unsubscribeLegacyChats();
  };
}

// // Mark messages as read
// export const markMessagesAsRead = async (chatId: string, userId: string): Promise<void> => {
//   try {
//     if (!chatId || !userId) {
//       throw new Error("Chat ID and User ID are required")
//     }

//     // Update chat unread count
//     const chatRef = doc(db, "chatList", chatId)
//     const chatDoc = await getDoc(chatRef)

//     if (chatDoc.exists()) {
//       const chatData = chatDoc.data() as Chat
//       const newUnreadCount = { ...chatData.unreadCount }
//       newUnreadCount[userId] = 0

//       await updateDoc(chatRef, {
//         unreadCount: newUnreadCount,
//       })
//     }

//     // Mark individual messages as read
//     const messagesQuery = query(
//       collection(db, "messages"),
//       where("chatId", "==", chatId),
//       where("senderId", "!=", userId),
//       where("read", "==", false),
//     )

//     const unreadMessages = await getDocs(messagesQuery)
//     const updatePromises = unreadMessages.docs.map((messageDoc) =>
//       updateDoc(doc(db, "messages", messageDoc.id), { read: true }),
//     )

//     await Promise.all(updatePromises)
//   } catch (error) {
//     console.error("Error marking messages as read:", error)
//   }
// }

export const generateChatId = (senderId: string, vendorId: string, productId: string) => {
  const chatId = (senderId > vendorId) ? `${productId}${senderId}${vendorId}` : `${productId}${vendorId}${senderId}`
  return chatId;
}

export const getOtherUserId = (obj: ChatMessage, myId: string): string | null => {
  const participantIds = Object.keys(obj.participants);
  const otherId = participantIds.find(id => id !== myId);
  return otherId || null;
}

