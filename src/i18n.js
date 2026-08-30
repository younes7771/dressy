import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      wardrobe: "MA GARDE-ROBE",
      calendar: "AGENDA",
      laundry: "PANIER À LINGE",
      all: "Tous",
      newCategory: "Nouveau",
      emptyShelf: "L'étagère est vide",
      emptyShelfText: "Touchez la clé pour ranger votre premier vêtement.",
      newClothing: "Nouveau vêtement",
      takePhoto: "Prendre une photo",
      pickGallery: "Choisir dans la galerie",
      storeClothing: "Ranger le vêtement",
      storeInWardrobe: "Ranger dans l'armoire",
      editClothing: "Modifier le vêtement",
      saveChanges: "Enregistrer les modifications",
      deleteClothing: "Supprimer le vêtement",
      shelf: "ÉTAGÈRE",
      changeShelf: "CHANGER D'ÉTAGÈRE",
      waitingPieces: "pièce(s) en attente",
      emptyLaundry: "Panier vide",
      emptyLaundryText: "Votre linge est tout propre.",
      wash: "LAVER",
      planOutfit: "Planifier une tenue",
      nothingPlanned: "Rien de prévu",
      choosePiece: "Choisir une pièce",
      addPiece: "Ajouter une pièce",
      emptyWardrobeModal: "Votre armoire est vide. Ajoutez d'abord des vêtements !",
      deleteAlertTitle: "Jeter ce vêtement ?",
      deleteAlertSub: "Il sera retiré de votre armoire et de votre agenda.",
      cancel: "Annuler",
      delete: "Supprimer"
    }
  },
  en: {
    translation: {
      wardrobe: "MY WARDROBE",
      calendar: "CALENDAR",
      laundry: "LAUNDRY BASKET",
      all: "All",
      newCategory: "New",
      emptyShelf: "Shelf is empty",
      emptyShelfText: "Tap the key to store your first item.",
      newClothing: "New clothing",
      takePhoto: "Take a photo",
      pickGallery: "Choose from gallery",
      storeClothing: "Store item",
      storeInWardrobe: "Store in wardrobe",
      editClothing: "Edit item",
      saveChanges: "Save changes",
      deleteClothing: "Delete item",
      shelf: "SHELF",
      changeShelf: "CHANGE SHELF",
      waitingPieces: "piece(s) waiting",
      emptyLaundry: "Empty basket",
      emptyLaundryText: "Your laundry is all clean.",
      wash: "WASH",
      planOutfit: "Plan an outfit",
      nothingPlanned: "Nothing planned",
      choosePiece: "Choose a piece",
      addPiece: "Add a piece",
      emptyWardrobeModal: "Your wardrobe is empty. Add clothes first!",
      deleteAlertTitle: "Discard this item?",
      deleteAlertSub: "It will be removed from your wardrobe and calendar.",
      cancel: "Cancel",
      delete: "Delete"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fr", // Langue par défaut (Français)
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;