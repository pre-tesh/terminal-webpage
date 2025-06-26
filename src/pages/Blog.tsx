
import React from 'react';
import { Calendar, Clock, ArrowLeft, ExternalLink } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "My Journey into Linux Kernel Development",
      excerpt: "How I started my path from computer science student to aspiring kernel developer through the LFx mentorship program.",
      date: "2024-01-15",
      readTime: "5 min read",
      tags: ["Kernel", "LFx", "Mentorship"]
    },
    {
      id: 2,
      title: "Understanding Memory Management in Linux",
      excerpt: "A deep dive into how the Linux kernel manages memory, from virtual memory to page allocation algorithms.",
      date: "2024-01-08",
      readTime: "8 min read",
      tags: ["Memory", "Kernel", "Systems"]
    },
    {
      id: 3,
      title: "Building Your First Kernel Module",
      excerpt: "Step-by-step guide to creating, compiling, and loading your first Linux kernel module with practical examples.",
      date: "2024-01-01",
      readTime: "12 min read",
      tags: ["Tutorial", "Kernel", "C Programming"]
    },
    {
      id: 4,
      title: "The Beauty of System Calls",
      excerpt: "Exploring the interface between user space and kernel space, and how system calls make it all possible.",
      date: "2023-12-20",
      readTime: "6 min read",
      tags: ["System Calls", "Architecture", "Linux"]
    },
    {
      id: 5,
      title: "Debugging Kernel Code: Tools and Techniques",
      excerpt: "Essential debugging tools and methodologies for kernel development, from printk to advanced debugging techniques.",
      date: "2023-12-10",
      readTime: "10 min read",
      tags: ["Debugging", "Tools", "Development"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.close()}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold font-mono text-green-400">Pritesh's Dev Blog</h1>
          </div>
          <div className="text-sm text-gray-400">
            Thoughts on kernel development & systems programming
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-green-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome to My Dev Journal
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Documenting my journey through Linux kernel development, systems programming, 
            and the fascinating world of low-level computing.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-black/40 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 hover:border-green-500/50 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {post.readTime}
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="text-center mt-12 p-8 bg-black/20 rounded-2xl border border-gray-700">
          <h3 className="text-xl font-bold mb-2 text-green-400">More Posts Coming Soon!</h3>
          <p className="text-gray-400">
            I'm constantly learning and sharing my experiences in kernel development. 
            Stay tuned for more deep dives into systems programming!
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Want to discuss any of these topics? Feel free to reach out!</p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
