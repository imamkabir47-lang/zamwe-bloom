import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          nav: {
            home: "Home",
            about: "About",
            services: "Services",
            events: "Events",
            gallery: "Gallery",
            members: "Members",
            resources: "Resources",
            contact: "Contact",
            join: "Join Now",
            login: "Login",
            forum: "Forum",
            courses: "Courses",
            marketplace: "Marketplace",
            blog: "Blog"
          },
          hero: {
            title: "Empowering Women Entrepreneurs",
            subtitle: "Join the leading network of women business owners in Northern Nigeria",
            cta: "Join ZAMWE Today"
          },
          common: {
            loading: "Loading...",
            submit: "Submit",
            cancel: "Cancel",
            save: "Save",
            delete: "Delete",
            edit: "Edit",
            search: "Search",
            filter: "Filter",
            viewMore: "View More",
            back: "Back",
            next: "Next",
            previous: "Previous"
          }
        }
      },
      ha: {
        translation: {
          nav: {
            home: "Gida",
            about: "Game da Mu",
            services: "Ayyuka",
            events: "Abubuwan da Suka Faru",
            gallery: "Hotunan",
            members: "Membobin",
            resources: "Kayan Aiki",
            contact: "Tuntube Mu",
            join: "Shiga Yanzu",
            login: "Shiga",
            forum: "Dandalin Tattaunawa",
            courses: "Darussa",
            marketplace: "Kasuwa",
            blog: "Labaran"
          },
          hero: {
            title: "Ƙarfafa Matan 'Yan Kasuwa",
            subtitle: "Shiga cibiyar matan 'yan kasuwa mafi girma a Arewacin Najeriya",
            cta: "Shiga ZAMWE Yau"
          },
          common: {
            loading: "Ana Lodi...",
            submit: "Aika",
            cancel: "Soke",
            save: "Ajiye",
            delete: "Share",
            edit: "Gyara",
            search: "Bincika",
            filter: "Tace",
            viewMore: "Duba Ƙari",
            back: "Koma Baya",
            next: "Na Gaba",
            previous: "Na Baya"
          }
        }
      },
      fr: {
        translation: {
          nav: {
            home: "Accueil",
            about: "À Propos",
            services: "Services",
            events: "Événements",
            gallery: "Galerie",
            members: "Membres",
            resources: "Ressources",
            contact: "Contact",
            join: "Rejoindre",
            login: "Connexion",
            forum: "Forum",
            courses: "Cours",
            marketplace: "Marketplace",
            blog: "Blog"
          },
          hero: {
            title: "Autonomiser les Femmes Entrepreneures",
            subtitle: "Rejoignez le réseau leader des femmes d'affaires du Nord du Nigeria",
            cta: "Rejoignez ZAMWE Aujourd'hui"
          },
          common: {
            loading: "Chargement...",
            submit: "Soumettre",
            cancel: "Annuler",
            save: "Enregistrer",
            delete: "Supprimer",
            edit: "Modifier",
            search: "Rechercher",
            filter: "Filtrer",
            viewMore: "Voir Plus",
            back: "Retour",
            next: "Suivant",
            previous: "Précédent"
          }
        }
      },
      ar: {
        translation: {
          nav: {
            home: "الرئيسية",
            about: "من نحن",
            services: "الخدمات",
            events: "الأحداث",
            gallery: "المعرض",
            members: "الأعضاء",
            resources: "الموارد",
            contact: "اتصل بنا",
            join: "انضم الآن",
            login: "تسجيل الدخول",
            forum: "المنتدى",
            courses: "الدورات",
            marketplace: "السوق",
            blog: "المدونة"
          },
          hero: {
            title: "تمكين سيدات الأعمال",
            subtitle: "انضم إلى الشبكة الرائدة لسيدات الأعمال في شمال نيجيريا",
            cta: "انضم إلى ZAMWE اليوم"
          },
          common: {
            loading: "جاري التحميل...",
            submit: "إرسال",
            cancel: "إلغاء",
            save: "حفظ",
            delete: "حذف",
            edit: "تعديل",
            search: "بحث",
            filter: "تصفية",
            viewMore: "عرض المزيد",
            back: "رجوع",
            next: "التالي",
            previous: "السابق"
          }
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
