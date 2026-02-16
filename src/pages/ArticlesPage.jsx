import Navbar from '../components/Navbar';

const ArticlesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          บทความ
        </h1>
        <p className="text-gray-600">
          หน้านี้กำลังอยู่ในระหว่างการพัฒนา
        </p>
      </div>
    </div>
  );
};

export default ArticlesPage;
