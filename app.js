document.addEventListener('DOMContentLoaded', () => {
  const jobsContainer = document.getElementById('jobs-container');
  const statusMessage = document.getElementById('status-message');
  const searchBtn = document.getElementById('search-btn');

  // Fetch jobs from server endpoint
  async function fetchJobs(query = 'developer', location = 'london') {
    jobsContainer.innerHTML = '';
    statusMessage.textContent = 'Loading tech jobs...';

    try {
      const response = await fetch(`/api/jobs?what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        statusMessage.textContent = 'No jobs found. Try adjusting your search keywords.';
        return;
      }

      statusMessage.textContent = `Found ${data.count.toLocaleString()} matching positions`;
      renderJobs(data.results);
    } catch (error) {
      console.error('Fetch error:', error);
      statusMessage.textContent = 'Failed to load jobs. Make sure server.js is running.';
    }
  }

  // Render job cards into HTML
  function renderJobs(jobs) {
    jobsContainer.innerHTML = jobs.map(job => {
      // Format salary range
      let salaryText = 'Salary not disclosed';
      if (job.salary_min && job.salary_max) {
        const min = Math.round(job.salary_min).toLocaleString();
        const max = Math.round(job.salary_max).toLocaleString();
        salaryText = min === max ? `£${min} / year` : `£${min} - £${max} / year`;
      }

      return `
        <article class="job-card">
          <div class="job-header">
            <h3>${escapeHtml(job.title)}</h3>
            <span class="company-name">${escapeHtml(job.company?.display_name || 'Direct Employer')}</span>
          </div>
          <div class="job-meta">
            <span class="location">📍 ${escapeHtml(job.location?.display_name || 'Remote/UK')}</span>
            <span class="salary">💰 ${salaryText}</span>
          </div>
          <p class="job-description">${escapeHtml(job.description.slice(0, 180))}...</p>
          <div class="job-footer">
            <a href="${job.redirect_url}" target="_blank" rel="noopener noreferrer" class="apply-btn">View & Apply</a>
          </div>
        </article>
      `;
    }).join('');
  }

  // Utility to prevent XSS attacks
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, match => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[match]));
  }

  // Handle Search Click
  searchBtn.addEventListener('click', () => {
    const job = document.getElementById('job-input').value.trim();
    const loc = document.getElementById('location-input').value.trim();
    fetchJobs(job, loc);
  });

  // Load default jobs on page start
  fetchJobs();
});
