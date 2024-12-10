// src/components/Admin/ProductManagement.tsx
import { useState, useRef } from 'react';
import { useProductStore } from '../../store/productStore';
import { toast } from 'react-hot-toast';
import { Upload, Trash2, Edit, X } from 'lucide-react';
import type { NailDesign } from '../../types/product';

function ProductForm({ 
  product, 
  onSubmit, 
  onCancel 
}: { 
  product?: NailDesign | null;
  onSubmit: (data: Partial<NailDesign>, images: File[]) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<NailDesign>>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    stock: product?.stock || 0,
    isPromotional: product?.isPromotional || false,
    promotionalPrice: product?.promotionalPrice || 0,
    images: product?.images || []
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData, newImages);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onCancel}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData(d => ({ ...d, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData(d => ({ ...d, price: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={e => setFormData(d => ({ ...d, stock: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              id="isPromotional"
              checked={formData.isPromotional}
              onChange={e => setFormData(d => ({ ...d, isPromotional: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isPromotional" className="text-sm text-gray-700">
              Promotional Item
            </label>
            
            {formData.isPromotional && (
              <div>
                <input
                  type="number"
                  value={formData.promotionalPrice}
                  onChange={e => setFormData(d => ({ ...d, promotionalPrice: Number(e.target.value) }))}
                  placeholder="Promotional Price"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Upload className="w-5 h-5 inline-block mr-2" />
              Upload Images
            </button>
            
            <div className="mt-2 grid grid-cols-4 gap-2">
              {(formData.images || []).map((url, index) => (
                <div key={url} className="relative">
                  <img src={url} alt="" className="w-24 h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setFormData(d => ({
                      ...d,
                      images: (d.images || []).filter((_, i) => i !== index)
                    }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {newImages.map((file, index) => (
                <div key={file.name} className="relative">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="" 
                    className="w-24 h-24 object-cover rounded" 
                  />
                  <button
                    type="button"
                    onClick={() => setNewImages(images => images.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#ff6b99]"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<NailDesign | null>(null);
  const { products, createProduct, updateProduct, deleteProduct } = useProductStore();

  const handleCreateProduct = async (data: Partial<NailDesign>, images: File[]) => {
    try {
      await createProduct(data, images);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async (
    id: string, 
    data: Partial<NailDesign>, 
    images: File[]
  ) => {
    try {
      await updateProduct(id, data, images);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string, imageUrls: string[]) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id, imageUrls);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Product Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Add New Design
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Rp {product.price.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id, product.images)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreating && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsCreating(false)}
        />
      )}
      {selectedProduct && (
        <ProductForm
          product={selectedProduct}
          onSubmit={(data, images) => handleUpdateProduct(selectedProduct.id, data, images)}
          onCancel={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

// Export ProductForm for reuse if needed
export { ProductForm };