export default {
  items: [
    //----------------------------------------------------
    // Seimic Dashboard
    //----------------------------------------------------
    {
      name: 'Dashboard',
      url: '/',
      router: 'dashboard',
      icon: 'fa fa-dashboard',
      badge: {
        variant: 'primary',
        text: ''
      }
    },

    {
      title: true,
      name: 'Project',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: 'Well',
      url: '/well',
      router: 'well',
      icon: 'fa fa-fire '
    },
    {
      name: 'Geobody',
      url: '/geobody',
      router: 'geobody',
      icon: 'fa fa-cube'
    },

    {
      title: true,
      name: 'Account',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: 'Profil',
      url: '/user-profile',
      router: 'user-profile',
      icon: 'fa fa-user '
    },
    {
      name: 'Logout',
      url: '/login',
      router: 'logout',
      icon: 'fa fa-lock'
    },
  ]
}
