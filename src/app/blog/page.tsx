import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import { getMediumPosts } from "@/data/medium-posts";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink, Search, Filter } from "lucide-react";

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
};

const BLUR_FADE_DELAY = 0.04;

// Define category configurations
const CATEGORIES = {
  "all": "All Posts",
  "website-development": "Website Development",
  "life-thoughts": "Life & Thoughts", 
  "medium-articles": "Medium Articles"
};

// Function to categorize posts
function categorizePost(post: any) {
  const tags = post.tags || [];
  const title = post.title.toLowerCase();
  
  // Check for Medium posts first
  if (post.type === 'medium') {
    return "medium-articles";
  }
  
  // Check for website development related posts
  if (tags.some((tag: string) => 
    ['Web Development', 'React', 'Next.js', 'TypeScript', 'Three.js', '3D Graphics', 'Maps', 'GitHub', 'API', 'Tutorial'].includes(tag)
  ) || title.includes('rubik') || title.includes('github') || title.includes('map') || title.includes('technical') || title.includes('architecture')) {
    return "website-development";
  }
  
  // Default to Life & Thoughts
  return "life-thoughts";
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const mediumPosts = getMediumPosts();

  // Combine and categorize all posts
  const allPosts = [
    ...posts.map(post => ({
      ...post,
      type: 'local' as const,
      url: `/blog/${post.slug}`,
      isExternal: false,
      publishedAt: post.metadata.publishedAt,
      title: post.metadata.title,
      summary: post.metadata.summary,
      tags: post.metadata.tags
    })),
    ...mediumPosts.map(post => ({
      ...post,
      type: 'medium' as const,
      url: post.url,
      isExternal: true
    }))
  ];

  // Add category to each post
  const postsWithCategory = allPosts.map(post => ({
    ...post,
    category: categorizePost(post)
  }));

  // Sort posts by date
  const sortedPosts = postsWithCategory.sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="mb-12">
          <h1 className="font-semibold text-2xl mb-1 tracking-tight">blog</h1>
        </div>
      </BlurFade>

      {/* Filter Bar - Hidden for now to match the minimalist style, can be re-enabled if needed */}
      {/* 
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-border/50 focus:border-border transition-all duration-200"
                id="search-input"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <select 
                className="px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-border/50 focus:border-border transition-all duration-200 appearance-none cursor-pointer"
                id="category-filter"
              >
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </BlurFade>
      */}
      
      {/* Posts Grid */}
      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <div className="space-y-0" id="posts-container">
          {sortedPosts.map((post, index) => (
            <BlurFade 
              key={post.type === 'local' ? post.slug : post.url} 
              delay={BLUR_FADE_DELAY * 4 + index * 0.05}
            >
              <Link
                className="group flex flex-col mb-4"
                href={post.url}
                target={post.isExternal ? "_blank" : undefined}
                rel={post.isExternal ? "noopener noreferrer" : undefined}
                data-category={post.category}
                data-title={post.title.toLowerCase()}
                data-summary={post.summary.toLowerCase()}
                data-tags={post.tags?.join(' ').toLowerCase() || ''}
              >
                <div className="w-full flex flex-col">
                  <h3 className="text-lg font-medium tracking-tight text-foreground group-hover:underline decoration-neutral-400 underline-offset-4 transition-all duration-300">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </p>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      </BlurFade>
      
      {sortedPosts.length === 0 && (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4 flex items-center justify-center">
              <Search className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">No blog posts found.</p>
          </div>
        </BlurFade>
      )}

      {/* JavaScript for filtering functionality */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('search-input');
            const categoryFilter = document.getElementById('category-filter');
            const postsContainer = document.getElementById('posts-container');
            const posts = postsContainer.querySelectorAll('[data-category]');
            
            function filterPosts() {
              const searchTerm = searchInput.value.toLowerCase();
              const selectedCategory = categoryFilter.value;
              
              posts.forEach(post => {
                const title = post.getAttribute('data-title') || '';
                const summary = post.getAttribute('data-summary') || '';
                const tags = post.getAttribute('data-tags') || '';
                const category = post.getAttribute('data-category') || '';
                
                const matchesSearch = title.includes(searchTerm) || 
                                    summary.includes(searchTerm) || 
                                    tags.includes(searchTerm);
                const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
                
                if (matchesSearch && matchesCategory) {
                  post.style.display = 'block';
                } else {
                  post.style.display = 'none';
                }
              });
            }
            
            searchInput.addEventListener('input', filterPosts);
            categoryFilter.addEventListener('change', filterPosts);
          });
        `
      }} />
    </section>
  );
}
