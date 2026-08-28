import { create } from 'zustand';

export const useStore = create((set) => ({
  clothes: [],
  
  // Lors de l'ajout, le vêtement est propre par défaut (isDirty: false)
  addClothing: (item) => set((state) => ({ 
    clothes: [{ ...item, isDirty: false }, ...state.clothes] 
  })),
  
  // Nouvelle fonction : Envoyer au linge sale
  markAsDirty: (id) => set((state) => ({
    clothes: state.clothes.map(item => 
      item.id === id ? { ...item, isDirty: true } : item
    )
  })),

  // Nouvelle fonction : Laver et remettre dans l'armoire
  markAsClean: (id) => set((state) => ({
    clothes: state.clothes.map(item => 
      item.id === id ? { ...item, isDirty: false } : item
    )
  })),
  
  plannedOutfits: {},
  
  addOutfitToDate: (date, item) => set((state) => {
    const currentOutfits = state.plannedOutfits[date] || [];
    if (currentOutfits.find(i => i.id === item.id)) return state;
    return {
      plannedOutfits: { ...state.plannedOutfits, [date]: [...currentOutfits, item] }
    };
  }),

  removeOutfitFromDate: (date, itemId) => set((state) => {
    const currentOutfits = state.plannedOutfits[date] || [];
    return {
      plannedOutfits: { ...state.plannedOutfits, [date]: currentOutfits.filter(i => i.id !== itemId) }
    };
  })
}));