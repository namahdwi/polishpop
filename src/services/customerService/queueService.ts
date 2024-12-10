import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDoc,
  query,
  orderBy,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CustomerQuery } from '../../types';
import { captureError } from '../../utils/errorTracking';

export interface QueueItem {
  id: string;
  queryId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'assigned' | 'resolved';
  customerPhone: string;
  customerName: string;
  queryMessage: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CustomerSupportQueue {
  private static instance: CustomerSupportQueue;
  private readonly collectionName = 'supportQueue';

  static getInstance(): CustomerSupportQueue {
    if (!this.instance) {
      this.instance = new CustomerSupportQueue();
    }
    return this.instance;
  }

  async addToQueue(query: CustomerQuery, priority: QueueItem['priority'] = 'medium'): Promise<QueueItem> {
    try {
      const queueData = {
        queryId: query.orderId || 'GENERAL',
        priority,
        status: 'pending' as const,
        customerPhone: query.customer.phone,
        customerName: query.customer.name,
        queryMessage: query.message,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.collectionName), queueData);
      
      return {
        id: docRef.id,
        ...queueData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      captureError(error as Error, { context: 'Add to Support Queue' });
      throw error;
    }
  }

  async assignAgent(queueItemId: string, agentId: string): Promise<QueueItem> {
    try {
      const queueRef = doc(db, this.collectionName, queueItemId);
      
      const updateData = {
        assignedTo: agentId,
        status: 'assigned' as const,
        updatedAt: serverTimestamp()
      };

      await updateDoc(queueRef, updateData);

      // Note: In a real application, you might want to fetch the updated document
      // to return the complete QueueItem
      return {
        id: queueItemId,
        ...updateData,
        // Adding placeholder values for required fields
        queryId: '',
        priority: 'medium',
        customerPhone: '',
        customerName: '',
        queryMessage: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      captureError(error as Error, { context: 'Assign Support Agent' });
      throw error;
    }
  }

  async resolveQuery(queueItemId: string): Promise<QueueItem> {
    try {
      const queueRef = doc(db, this.collectionName, queueItemId);
      
      const updateData = {
        status: 'resolved' as const,
        updatedAt: serverTimestamp()
      };

      await updateDoc(queueRef, updateData);

      // Note: In a real application, you might want to fetch the updated document
      // to return the complete QueueItem
      return {
        id: queueItemId,
        ...updateData,
        // Adding placeholder values for required fields
        queryId: '',
        priority: 'medium',
        customerPhone: '',
        customerName: '',
        queryMessage: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      captureError(error as Error, { context: 'Resolve Support Query' });
      throw error;
    }
  }

  // Additional helper methods you might want to add:
  async getQueueItem(queueItemId: string): Promise<QueueItem> {
    try {
      const docRef = doc(db, this.collectionName, queueItemId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Queue item not found');
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as QueueItem;
    } catch (error) {
      captureError(error as Error, { context: 'Get Queue Item' });
      throw error;
    }
  }

  async getPendingQueries(): Promise<QueueItem[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QueueItem[];
    } catch (error) {
      captureError(error as Error, { context: 'Get Pending Queries' });
      throw error;
    }
  }
} 