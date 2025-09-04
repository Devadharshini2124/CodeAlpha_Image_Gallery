// Gallery Configuration and Data
const GALLERY_CONFIG = {
    itemsPerPage: 6,
    animationDuration: 300
};

// Sample image data (replace with your own images)
const imageData = [
    { id: 1, src: 'https://picsum.photos/400/300?random=1', title: 'Mountain Vista', category: 'nature' },
    { id: 2, src: 'https://picsum.photos/400/300?random=2', title: 'Modern Building', category: 'architecture' },
    { id: 3, src: 'https://picsum.photos/400/300?random=3', title: 'Abstract Art', category: 'abstract' },
    { id: 4, src: 'https://picsum.photos/400/300?random=4', title: 'Forest Path', category: 'nature' },
    { id: 5, src: 'https://picsum.photos/400/300?random=5', title: 'City Skyline', category: 'architecture' },
    { id: 6, src: 'https://picsum.photos/400/300?random=6', title: 'Portrait Study', category: 'portrait' },
    { id: 7, src: 'https://picsum.photos/400/300?random=7', title: 'Ocean Waves', category: 'nature' },
    { id: 8, src: 'https://picsum.photos/400/300?random=8', title: 'Geometric Patterns', category: 'abstract' },
    { id: 9, src: 'https://picsum.photos/400/300?random=9', title: 'Historic Bridge', category: 'architecture' },
    { id: 10, src: 'https://picsum.photos/400/300?random=10', title: 'Sunset Portrait', category: 'portrait' },
    { id: 11, src: 'https://picsum.photos/400/300?random=11', title: 'Desert Dunes', category: 'nature' },
    { id: 12, src: 'https://picsum.photos/400/300?random=12', title: 'Color Splash', category: 'abstract' },
    { id: 13, src: 'https://picsum.photos/400/300?random=13', title: 'Glass Tower', category: 'architecture' },
    { id: 14, src: 'https://picsum.photos/400/300?random=14', title: 'Street Portrait', category: 'portrait' },
    { id: 15, src: 'https://picsum.photos/400/300?random=15', title: 'Autumn Forest', category: 'nature' }
];

// Gallery State
let currentFilter = 'all';
let currentPage = 1;
let currentLightboxIndex = 0;
let filteredImages = [];

// DOM Elements
const gallery = document.getElementById('gallery');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('loadMore');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Gallery Class
class ImageGallery {
    constructor() {
        this.init();
        this.bindEvents();
    }

    // Initialize gallery
    init() {
        filteredImages = [...imageData];
        this.renderGallery();
        this.updateLoadMoreButton();
    }

    // Create gallery item HTML
    createGalleryItemHTML(image, index) {
        return `
            <img src="${image.src}" alt="${image.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <div class="overlay-content">
                    <div class="overlay-title">${image.title}</div>
                    <div class="overlay-category">${image.category}</div>
                </div>
            </div>
        `;
    }

    // Render gallery items
    renderGallery() {
        const startIndex = 0;
        const endIndex = currentPage * GALLERY_CONFIG.itemsPerPage;
        const imagesToShow = filteredImages.slice(startIndex, endIndex);

        // Clear existing items
        gallery.innerHTML = '';

        // Create and append new items
        imagesToShow.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = this.createGalleryItemHTML(image, index);
            
            // Add click event for lightbox
            galleryItem.addEventListener('click', () => this.openLightbox(index));
            
            gallery.appendChild(galleryItem);
        });
    }

    // Filter images by category
    filterImages(filter) {
        currentFilter = filter;
        currentPage = 1;
        
        if (filter === 'all') {
            filteredImages = [...imageData];
        } else {
            filteredImages = imageData.filter(img => img.category === filter);
        }

        this.renderGallery();
        this.updateLoadMoreButton();
    }

    // Load more images
    loadMore() {
        currentPage++;
        this.renderGallery();
        this.updateLoadMoreButton();
    }

    // Update load more button visibility
    updateLoadMoreButton() {
        const totalShown = currentPage * GALLERY_CONFIG.itemsPerPage;
        loadMoreBtn.style.display = totalShown >= filteredImages.length ? 'none' : 'flex';
    }

    // Open lightbox with image
    openLightbox(index) {
        currentLightboxIndex = index;
        const currentImages = filteredImages.slice(0, currentPage * GALLERY_CONFIG.itemsPerPage);
        
        lightboxImage.src = currentImages[index].src;
        lightboxImage.alt = currentImages[index].title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Navigate lightbox (next/previous)
    navigateLightbox(direction) {
        const currentImages = filteredImages.slice(0, currentPage * GALLERY_CONFIG.itemsPerPage);
        
        if (direction === 'next' && currentLightboxIndex < currentImages.length - 1) {
            currentLightboxIndex++;
        } else if (direction === 'prev' && currentLightboxIndex > 0) {
            currentLightboxIndex--;
        }
        
        lightboxImage.src = currentImages[currentLightboxIndex].src;
        lightboxImage.alt = currentImages[currentLightboxIndex].title;
    }

    // Bind all event listeners
    bindEvents() {
        // Filter button events
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Filter images
                this.filterImages(filter);
            });
        });

        // Load more button event
        loadMoreBtn.addEventListener('click', () => {
            this.loadMore();
        });

        // Lightbox events
        lightboxClose.addEventListener('click', () => {
            this.closeLightbox();
        });

        lightboxPrev.addEventListener('click', () => {
            this.navigateLightbox('prev');
        });

        lightboxNext.addEventListener('click', () => {
            this.navigateLightbox('next');
        });

        // Close lightbox when clicking outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.navigateLightbox('prev');
                        break;
                    case 'ArrowRight':
                        this.navigateLightbox('next');
                        break;
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            // Re-render gallery on significant resize
            this.renderGallery();
        }, 250));
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Utility Functions
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function preloadImages(images) {
    return Promise.all(images.map(image => preloadImage(image.src)));
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create gallery instance
    const gallery = new ImageGallery();
    
    // Optional: Preload images for better performance
    // preloadImages(imageData.slice(0, 6)).then(() => {
    //     console.log('Initial images preloaded');
    // });

    // Add loading animation (optional)
    setTimeout(() => {
        document.querySelector('.gallery-container').style.opacity = '1';
    }, 100);
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ImageGallery, imageData };
}