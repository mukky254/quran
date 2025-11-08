export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-green-200">
          <h1 className="text-6xl font-bold text-green-800 mb-6">
            ﷽
          </h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Islamic Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive digital companion for Quran, Prayer, and Community
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <div className="text-3xl mb-3">📖</div>
              <h3 className="font-semibold text-green-800 mb-2">Quran Reader</h3>
              <p className="text-green-600">Complete Quran with translations</p>
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <div className="text-3xl mb-3">🕌</div>
              <h3 className="font-semibold text-blue-800 mb-2">Prayer Times</h3>
              <p className="text-blue-600">Accurate prayer times & Qibla</p>
            </div>
            
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-purple-800 mb-2">Community</h3>
              <p className="text-purple-600">Connect with Muslims worldwide</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold text-lg shadow-lg transition-colors">
              Get Started
            </button>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-2xl font-semibold text-lg shadow-lg transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
