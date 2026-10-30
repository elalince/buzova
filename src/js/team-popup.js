document.addEventListener('DOMContentLoaded', () => {
  const teamLinks = document.querySelectorAll('.footer__team-link');
  const teamPopups = document.querySelectorAll('.team-popup');

  teamLinks.forEach((teamLink, index) => {
    const teamPopup = teamPopups[index] || (teamPopups.length === 1 ? teamPopups[0] : null);

    if (!teamPopup) {
      return;
    }

    const showTeamPopup = () => teamPopup.classList.add('is-visible');
    const hideTeamPopup = () => teamPopup.classList.remove('is-visible');

    teamLink.addEventListener('mouseenter', showTeamPopup);
    teamLink.addEventListener('mouseleave', hideTeamPopup);
    teamLink.addEventListener('focus', showTeamPopup);
    teamLink.addEventListener('blur', hideTeamPopup);
  });
});
