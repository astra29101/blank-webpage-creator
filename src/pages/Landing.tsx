
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CourseCard from '@/components/CourseCard';
import { BookOpen, Users, Award, CheckCircle, Shield, ArrowRight, Zap, Target, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const Landing = () => {
  const { user } = useAuth();

  // State for stats and featured courses
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    successRate: 95
  });
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/stats`);
        const data = await res.json();
        if (res.ok) {
          setStats({
            students: data.students || 0,
            courses: data.courses || 0,
            successRate: data.successRate || 95
          });
        }
      } catch {
        // fallback to default
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    // Fetch featured courses from backend (first 3 approved courses)
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await fetch(`${SERVER_URL}/api/courses`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setFeaturedCourses(data.slice(0, 3));
        }
      } catch {
        setFeaturedCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="relative">
                  <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg animate-glow">
                    <Zap className="w-4 h-4 mr-2" />
                    AI-Powered Learning Platform
                  </Badge>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-gray-900">Learn</span>
                  <span className="block gradient-text">Beyond Limits</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Experience the future of education with our cutting-edge platform. 
                  Join millions of learners worldwide and unlock your potential with 
                  AI-enhanced courses designed for the digital age.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                  asChild
                >
                  <Link to="/courses" className="flex items-center">
                    Explore Courses
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                {!user && (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="group border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105" 
                    asChild
                  >
                    <Link to="/signup" className="flex items-center">
                      Start Learning Free
                      <Target className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                    </Link>
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="group text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl font-bold gradient-text group-hover:animate-pulse">
                    {stats.students > 1000 ? `${(stats.students/1000).toFixed(1)}K+` : stats.students}
                  </div>
                  <div className="text-gray-600 font-medium">Active Students</div>
                </div>
                <div className="group text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl font-bold gradient-text group-hover:animate-pulse">
                    {stats.courses > 0 ? `${stats.courses}+` : '0'}
                  </div>
                  <div className="text-gray-600 font-medium">Expert Courses</div>
                </div>
                <div className="group text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl font-bold gradient-text group-hover:animate-pulse">
                    {stats.successRate}%
                  </div>
                  <div className="text-gray-600 font-medium">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=600&fit=crop" 
                  alt="Student learning online"
                  className="rounded-3xl shadow-2xl modern-shadow-lg transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-green-500/20 rounded-3xl"></div>
              </div>
              
              {/* Floating achievement card */}
              <div className="absolute -bottom-8 -left-8 z-20 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 animate-float">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Certificate Ready</div>
                    <div className="text-gray-600">Industry recognized credentials</div>
                  </div>
                </div>
              </div>
              
              {/* Floating stats card */}
              <div className="absolute -top-8 -right-8 z-20 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Global Access</div>
                    <div className="text-gray-600">Learn from anywhere</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EduFlow?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience next-generation learning with cutting-edge technology and world-class content
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="h-full p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:animate-pulse">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-gray-900">Expert Instructors</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Learn from industry pioneers and thought leaders with decades of real-world experience 
                    in cutting-edge technologies and methodologies.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="h-full p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:animate-pulse">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-gray-900">Verified Certificates</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Earn blockchain-verified certificates that showcase your skills to employers 
                    and open doors to new career opportunities in the digital economy.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="h-full p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:animate-pulse">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-gray-900">Lifetime Access</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Access your courses anytime, anywhere with our mobile-first platform. 
                    Learn at your own pace with offline capabilities and cloud synchronization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
              <p className="text-xl text-gray-600">Discover our most popular and highly-rated learning experiences</p>
            </div>
            <Button 
              variant="outline" 
              className="group border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105" 
              asChild
            >
              <Link to="/courses" className="flex items-center">
                View All Courses
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          {loadingCourses ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-4 animate-spin">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <p className="text-xl text-gray-600">Loading amazing courses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <div 
                  key={course._id || course.id} 
                  className="transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CourseCard
                    course={course}
                    viewDetailsLink={`/courses/${course._id || course.id}`}
                    showActions={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600"></div>
          
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of learners who are already building their tomorrow. 
              Start your journey today with our free tier and unlock unlimited possibilities.
            </p>
            <Button 
              size="lg" 
              className="group bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-0" 
              asChild
            >
              <Link to="/signup" className="flex items-center">
                Start Learning Free
                <Zap className="w-6 h-6 ml-3 group-hover:animate-pulse" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Landing;
