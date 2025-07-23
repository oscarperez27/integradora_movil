import { API_BASE_URL } from './apiConfig';

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/product/products`);
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getProducts:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/product/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Error al crear producto');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createProduct:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar producto');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateProduct:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/product/delete/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar producto');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    throw error;
  }
};