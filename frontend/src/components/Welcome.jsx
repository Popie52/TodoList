import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              YourApp
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the power of modern web applications. Our platform provides 
            innovative solutions to help you achieve your goals with elegance and efficiency.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Fast & Reliable
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Built with modern technologies to ensure lightning-fast performance 
              and rock-solid reliability for all your needs.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Secure & Private
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Your data is protected with enterprise-grade security measures 
              and privacy-first design principles.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Easy to Use
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Intuitive interface designed for everyone, from beginners to 
              advanced users. Get started in minutes.
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              We're committed to providing exceptional experiences through innovative 
              technology and user-centered design. Our platform combines powerful 
              functionality with elegant simplicity, making complex tasks feel effortless.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Modern Technology
                </h4>
                <p className="text-gray-600">
                  Built with cutting-edge frameworks and tools to deliver 
                  the best possible performance and user experience.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  24/7 Support
                </h4>
                <p className="text-gray-600">
                  Our dedicated support team is always here to help you 
                  succeed and answer any questions you might have.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-8">
            Join thousands of users who trust our platform for their success.
          </p>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;