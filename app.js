document.addEventListener('DOMContentLoaded', () => {
  const jobsContainer = document.getElementById('jobs-container');
  const statusMessage = document.getElementById('status-message');
  const searchBtn = document.getElementById('search-btn');
  const sortSelect = document.getElementById('sort-select');

  let loadedJobListings = [];

  // Main function to fetch job records from our backend proxy
  async function fetchJobs(query = 'developer', location = 'london') {
    jobsContainer.innerHTML = '<div class="status-message">Loading opportunities...</div>';
    statusMessage.textContent = 'Fetching job data from API...';

    try {
      const response = await fetch(`/api/jobs?what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`);

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        statusMessage.textContent = 'No matching positions found. Try broadening your terms.';
        jobsContainer.innerHTML = '';
        updateMetrics([], 0);
        return;
      }

      loadedJobListings = data.results;
      statusMessage.textContent = `Showing active listings for "${query}" in ${location}`;

      updateMetrics(loadedJobListings, data.count);
      processAndRender();

    } catch (err) {
      console.error('API connection failed:', err);
      statusMessage.textContent = 'Could not reach server. Ensure backend node service is running.';
      jobsContainer.innerHTML = '';
    }
  }

  // Update metrics dashboard values
  function updateMetrics(jobs, totalCount) {
    document.getElementById('stat-count').textContent = (totalCount || jobs.length).toLocaleString();

    const maxSalaries = jobs.map(j => j.salary_max).filter(s => s > 0);
    const avg = maxSalaries.length
      ? Math.round(maxSalaries.reduce((acc, val) => acc + val, 0) / maxSalaries.length)
      : 0;

    document.getElementById('stat-avg').textContent = avg ? `£${avg.toLocaleString()}` : 'N/A';
  }

  // Sort and display job list based on user selections
  function processAndRender() {
    let sortedJobs = [...loadedJobListings];
    const userSort = sortSelect.value;

    if (userSort === 'salary-high') {
      sortedJobs.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    } else if (userSort === 'salary-low') {
      sortedJobs.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
    }

    renderJobs(sortedJobs);
  }

  // Generate and insert HTML cards dynamically with correct layout wrappers
  function renderJobs(jobs) {
    jobsContainer.innerHTML = jobs.map(job => {
      let salaryDisplay = 'Not disclosed';
      if (job.salary_min && job.salary_max) {
        const minVal = Math.round(job.salary_min).toLocaleString();
        const maxVal = Math.round(job.salary_max).toLocaleString();
        salaryDisplay = minVal === maxVal ? `£${minVal}` : `£${minVal} - £${maxVal}`;
      }

      return `
        <article class="job-card">
          <div>
            <h3>${sanitizeText(job.title)}</h3>
            <span class="company-name">${sanitizeText(job.company?.display_name || 'Direct Employer')}</span>
            
            <div class="job-meta">
              <span class="meta-badge">📍 ${sanitizeText(job.location?.display_name || 'Remote/UK')}</span>
              <span class="meta-badge salary-badge">💰 ${salaryDisplay}</span>
            </div>

            <p class="job-description">${sanitizeText(job.description.slice(0, 160))}...</p>
          </div>

          <a href="${job.redirect_url}" target="_blank" rel="noopener noreferrer" class="apply-btn">View Job Posting</a>
        </article>
      `;
    }).join('');
  }

  // Helper security function to sanitize strings against XSS injection
  function sanitizeText(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, match => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[match]));
  }

  // Event handlers for UI elements
  searchBtn.addEventListener('click', () => {
    const jobInput = document.getElementById('job-input').value.trim();
    const locInput = document.getElementById('location-input').value.trim();
    fetchJobs(jobInput, locInput);
  });

  sortSelect.addEventListener('change', processAndRender);

  // Initialize app with default search query
  fetchJobs();
});
