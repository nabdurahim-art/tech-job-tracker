document.addEventListener('DOMContentLoaded', () => {
  const jobsContainer = document.getElementById('jobs-container');
  const statusMessage = document.getElementById('status-message');
  const searchBtn = document.getElementById('search-btn');
  const sortSelect = document.getElementById('sort-select');

  let currentJobs = [];

  // Fetch jobs from Express server endpoint
  async function fetchJobs(query = 'developer', location = 'london') {
    jobsContainer.innerHTML = '<div class="status-message">Loading opportunities...</div>';
    statusMessage.textContent = 'Contacting server...';

    try {
      const response = await fetch(`/api/jobs?what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        statusMessage.textContent = 'No jobs found. Try adjusting your search criteria.';
        jobsContainer.innerHTML = '';
        updateMetrics([], 0);
        return;
      }

      currentJobs = data.results;
      statusMessage.textContent = `Displaying roles for "${query}" in ${location}`;

      updateMetrics(currentJobs, data.count);
      processAndRender();

    } catch (error) {
      console.error('Fetch error:', error);
      statusMessage.textContent = 'Unable to load jobs. Verify server.js is running.';
      jobsContainer.innerHTML = '';
    }
  }

  // Calculate dynamic stats for metrics bar
  function updateMetrics(jobs, totalCount) {
    document.getElementById('stat-count').textContent = (totalCount || jobs.length).toLocaleString();

    const maxSalaries = jobs.map(j => j.salary_max).filter(s => s > 0);
    const avg = maxSalaries.length
      ? Math.round(maxSalaries.reduce((sum, val) => sum + val, 0) / maxSalaries.length)
      : 0;

    document.getElementById('stat-avg').textContent = avg ? `£${avg.toLocaleString()}` : 'N/A';
  }

  // Handle local sorting and data manipulation
  function processAndRender() {
    let sortedJobs = [...currentJobs];
    const sortVal = sortSelect.value;

    if (sortVal === 'salary-high') {
      sortedJobs.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    } else if (sortVal === 'salary-low') {
      sortedJobs.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
    }

    renderJobs(sortedJobs);
  }

  // Render job cards into HTML
  function renderJobs(jobs) {
    jobsContainer.innerHTML = jobs.map(job => {
      let salaryText = 'Not disclosed';
      if (job.salary_min && job.salary_max) {
        const min = Math.round(job.salary_min).toLocaleString();
        const max = Math.round(job.salary_max).toLocaleString();
        salaryText = min === max ? `£${min}` : `£${min} - £${max}`;
      }

      return `
        <article class="job-card">
          <div class="job-card-header">
            <h3>${escapeHtml(job.title)}</h3>
            <span class="company-name">${escapeHtml(job.company?.display_name || 'Direct Employer')}</span>
          </div>

          <div class="job-meta">
            <span class="meta-badge">📍 ${escapeHtml(job.location?.display_name || 'Remote/UK')}</span>
            <span class="meta-badge salary-badge">💰 ${salaryText}</span>
          </div>

          <p class="job-description">${escapeHtml(job.description.slice(0, 160))}...</p>

          <a href="${job.redirect_url}" target="_blank" rel="noopener noreferrer" class="apply-btn">View Job Posting</a>
        </article>
      `;
    }).join('');
  }

  // XSS protection helper
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, match => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[match]));
  }

  // Listeners
  searchBtn.addEventListener('click', () => {
    const job = document.getElementById('job-input').value.trim();
    const loc = document.getElementById('location-input').value.trim();
    fetchJobs(job, loc);
  });

  sortSelect.addEventListener('change', processAndRender);

  // Default fetch
  fetchJobs();
});
