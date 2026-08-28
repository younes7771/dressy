import { create } from 'zustand';

export const useStore = create((set) => ({
  // --- CATÉGORIES ---
  categories: ['Hauts', 'Bas', 'Chaussures', 'Accessoires'],
  addCategory: (newCat) => set((state) => {
    if (!state.categories.includes(newCat)) {
      return { categories: [...state.categories, newCat] };
    }
    return state;
  }),

  // --- VÊTEMENTS (CRUD) ---
  clothes: [],
  
  // CREATE
  addClothing: (item) => set((state) => ({ 
    clothes: [{ ...item, isDirty: false }, ...state.clothes] 
  })),

  // UPDATE (Modifier la catégorie)
  updateClothingCategory: (id, newCategory) => set((state) => ({
    clothes: state.clothes.map(item => 
      item.id === id ? { ...item, category: newCategory } : item
    )
  })),

  // DELETE (Supprimer définitivement de l'armoire et du calendrier)
  deleteClothing: (id) => set((state) => ({
    clothes: state.clothes.filter(item => item.id !== id),
    plannedOutfits: Object.fromEntries(
      Object.entries(state.plannedOutfits).map(([date, outfits]) => [
        date, 
        outfits.filter(item => item.id !== id)
      ])
    )
  })),

  // --- LINGE SALE ---
  markAsDirty: (id) => set((state) => ({
    clothes: state.clothes.map(item => item.id === id ? { ...item, isDirty: true } : item)
  })),

  markAsClean: (id) => set((state) => ({
    clothes: state.clothes.map(item => item.id === id ? { ...item, isDirty: false } : item)
  })),
  
  // --- CALENDRIER ---
  plannedOutfits: {},
  
  addOutfitToDate: (date, item) => set((state) => {
    const currentOutfits = state.plannedOutfits[date] || [];
    if (currentOutfits.find(i => i.id === item.id)) return state;
    return { 
      plannedOutfits: { 
        ...state.plannedOutfits, 
        [date]: [...currentOutfits, item] 
      } 
    };
  }),
  
  removeOutfitFromDate: (date, itemId) => set((state) => {
    const currentOutfits = state.plannedOutfits[date] || [];
    return { 
      plannedOutfits: { 
        ...state.plannedOutfits, 
        [date]: currentOutfits.filter(i => i.id !== itemId) 
      } 
    };
  })
}));