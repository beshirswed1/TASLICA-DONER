import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserShield, 
  faMapMarkerAlt, 
  faPhone, 
  faClock,
  faUtensils
} from '@fortawesome/free-solid-svg-icons';
import { 
  
  faWhatsapp, 
  
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 border-t border-gray-800">
      {/* القسم الرئيسي للفوتر */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          
          {/* العمود الأول: معلومات المطعم */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-500 mb-6">
              <FontAwesomeIcon icon={faUtensils} size="xl" />
              <h2 className="text-2xl font-black tracking-tight text-white">TAŞLICA DÖNER</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              En taze malzemelerle hazırlanan eşsiz lezzetlerimizi keşfedin. 
              Siparişleriniz özenle hazırlanıp size ulaştırılır.
            </p>
            {/* أيقونات السوشيال ميديا */}
            <div className="flex gap-4 pt-4">
              
              <a href="https://wa.me/905453155933" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </a>
              
            </div>
          </div>

          {/* العمود الثاني: تواصل معنا */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              İletişim
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-orange-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <a href="https://maps.app.goo.gl/ekxgWAtGGSqZBuic7" target="_blank" rel="noopener noreferrer" className="block mb-5">
                <li className="flex items-start gap-3 hover:text-orange-400 transition-colors cursor-pointer">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-1 text-orange-500 w-4" />
                  <span>Sacır, 37100. Cd., 27080 Şehitkamil/Gaziantep</span>
                </li>
              </a>

              <li className="flex items-center gap-3 hover:text-orange-400 transition-colors cursor-pointer">
                <FontAwesomeIcon icon={faPhone} className="text-orange-500 w-4" />
                <a href="tel:+905453155933" dir="ltr">+90 545 315 59 33</a>
              </li>
            </ul>
          </div>

          {/* العمود الثالث: أوقات العمل */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Çalışma Saatleri
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-orange-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-gray-500 w-4" /> Pazartesi - Cumartesi
                </span>
                <span className="text-white font-medium">09:00 - 20:00</span>
              </li>
              
            </ul>
          </div>

        </div>
      </div>

      {/* الشريط السفلي (حقوق النشر ورابط الإدارة) */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} TAŞLICA DÖNER. Tüm hakları saklıdır.
          </p>
          
          {/* رابط الإدارة الخفي والمحترم */}
          <Link 
            href="/admin" 
            className="text-[11px] text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-900"
          >
            <FontAwesomeIcon icon={faUserShield} /> 
          </Link>
        </div>
      </div>
    </footer>
  );
}