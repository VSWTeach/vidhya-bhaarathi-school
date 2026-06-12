import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: 'Welcome to Vidya Bharati Public School',
      description: 'Excellence in Education Since 1995 | CBSE Affiliated',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
      button: 'Apply Now',
      link: '/admissions'
    },
    {
      title: 'State-of-the-Art Campus',
      description: 'Modern Facilities for Holistic Development',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200',
      button: 'Explore Campus',
      link: '/virtual-tour'
    },
    {
      title: 'Digital Learning Hub',
      description: 'Smart Classrooms & Online Resources',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
      button: 'Learn More',
      link: '/academics'
    },
    {
      title: 'Admissions Open 2025-26',
      description: 'Limited Seats Available. Apply Now!',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200',
      button: 'Register Now',
      link: '/admissions'
    }
  ];

  const features = [
    { icon: '🎓', title: 'Expert Faculty', desc: 'Highly qualified teachers with years of experience', color: 'from-blue-500 to-blue-600' },
    { icon: '🏫', title: 'Modern Campus', desc: 'Smart classrooms, labs, library, sports complex', color: 'from-green-500 to-green-600' },
    { icon: '🌍', title: 'Global Curriculum', desc: 'CBSE affiliated with international standards', color: 'from-purple-500 to-purple-600' },
    { icon: '🏆', title: '100% Results', desc: 'Consistent academic excellence', color: 'from-orange-500 to-orange-600' },
    { icon: '🚌', title: 'Transport Facility', desc: 'Safe bus service across the city', color: 'from-red-500 to-red-600' },
    { icon: '💻', title: 'Digital Learning', desc: 'Smart classes and online resources', color: 'from-indigo-500 to-indigo-600' },
  ];

  const stats = [
    { value: '2500+', label: 'Happy Students', icon: '👨‍🎓' },
    { value: '120+', label: 'Expert Teachers', icon: '👩‍🏫' },
    { value: '65+', label: 'Smart Classrooms', icon: '🏫' },
    { value: '29+', label: 'Years of Excellence', icon: '🏆' },
  ];

  const testimonials = [
    { name: 'Rajesh Kumar', role: 'Parent of Class 10 Student', text: 'Excellent school with great teachers. My child\'s progress has been remarkable.', rating: 5 },
    { name: 'Priya Sharma', role: 'Parent of Class 8 Student', text: 'The facilities and teaching methodology are outstanding. Highly recommended!', rating: 5 },
    { name: 'Dr. Amit Patel', role: 'Alumni Parent', text: 'Best decision we made for our child\'s education. Holistic development is excellent.', rating: 5 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      <SEO 
        title="Home | Premier CBSE School in Delhi" 
        description="Vidya Bharati Public School - Top-rated CBSE school in Delhi offering quality education since 1995. State-of-the-art campus, experienced faculty, holistic development."
      />
      
      {/* Hero Slider */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center text-white text-center">
              <div className="max-w-3xl px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeInUp">{slide.title}</h1>
                <p className="text-lg md:text-2xl mb-4">{slide.description}</p>
                <p className="text-base md:text-lg mb-8 font-devanagari">विद्या परम भूषणम्</p>
                <Link 
                  to={slide.link} 
                  className="inline-block bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition transform hover:scale-105 duration-300"
                >
                  {slide.button}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Navigation Dots */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-yellow-500 w-6 md:w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
        
        {/* Slider Navigation Arrows */}
        <button 
          onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
        >
          ◀
        </button>
        <button 
          onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
        >
          ▶
        </button>
      </div>
      
      {/* Notice Board */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center flex-wrap gap-3">
            <div className="bg-red-600 text-white px-4 py-1 rounded-full font-bold text-sm animate-pulse">📢 NOTICE</div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="mx-4">🎓 Admissions for 2025-26 are now open! Apply before March 31st</span>
                <span className="mx-4">📅 Parent-Teacher Meeting on December 20, 2024</span>
                <span className="mx-4">🏆 Annual Sports Day - December 25, 2024</span>
                <span className="mx-4">❄️ Winter Break from Dec 25 to Jan 1, 2025</span>
              </div>
            </div>
            <Link to="/notices" className="text-blue-600 text-sm hover:underline">View All →</Link>
          </div>
        </div>
      </div>
      
      {/* Statistics Counter */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm md:text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Vision & Mission</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Guiding principles that shape our educational approach</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-800">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower every student with knowledge, skills, and values to become responsible global citizens who contribute meaningfully to society.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold mb-4 text-green-800">Our Mission</h3>
              <ul className="text-gray-700 space-y-2">
                <li>✓ Provide quality education accessible to all</li>
                <li>✓ Foster holistic development of every child</li>
                <li>✓ Encourage innovation and critical thinking</li>
                <li>✓ Build strong character and ethical values</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Why Choose Vidya Bharati?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">What makes us the preferred choice for quality education</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
                <div className={`bg-gradient-to-r ${feature.color} p-5 text-center group-hover:p-6 transition-all duration-300`}>
                  <div className="text-5xl mb-2">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">What Parents Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Trusted by thousands of parents across Delhi</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold text-blue-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Principal's Message */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-28 h-28 bg-white rounded-full mx-auto mb-6 flex items-center justify-center text-6xl shadow-lg">👩‍🏫</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Principal's Message</h3>
            <p className="text-blue-200 mb-4">Dr. Mrs. S. Radhakrishnan | M.Sc., M.Ed., Ph.D.</p>
            <p className="text-lg leading-relaxed">
              "At Vidya Bharati Public School, we believe that education is not just about academic excellence, 
              but about nurturing young minds to become compassionate, responsible, and innovative leaders of tomorrow. 
              Our commitment is to provide a safe, supportive, and stimulating environment where every child can discover 
              their unique potential and flourish."
            </p>
            <div className="mt-6">
              <div className="text-yellow-400 text-2xl">✿</div>
              <p className="text-blue-200 mt-2">With warm regards,</p>
              <p className="font-bold">Principal</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Ready to Join Vidya Bharati?</h2>
          <p className="text-xl text-blue-800 mb-8">Limited seats available for the academic year 2025-26</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admissions" className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition transform hover:scale-105 inline-block">
              Apply Now
            </Link>
            <Link to="/contact" className="border-2 border-blue-900 text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-900 hover:text-white transition transform hover:scale-105 inline-block">
              Contact Us
            </Link>
            <Link to="/virtual-tour" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition transform hover:scale-105 inline-block">
              Virtual Tour
            </Link>
          </div>
        </div>
      </section>
      
      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </>
  );
};

export default Home;