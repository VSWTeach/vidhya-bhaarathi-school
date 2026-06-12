import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">About Vidya Bharati</h1>
      <div className="max-w-3xl mx-auto">
        <p className="text-lg mb-6">
          Founded in 1995, Vidya Bharati Public School has been a pioneer in providing quality education. 
          Our mission is to nurture young minds and prepare them for the challenges of tomorrow.
        </p>
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p>To empower every student with knowledge, skills, and values to become responsible global citizens.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p>To provide quality education accessible to all and foster holistic development.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
