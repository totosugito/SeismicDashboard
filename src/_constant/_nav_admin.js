export default {
  items: [
    //----------------------------------------------------
    // Seimic Dashboard
    //----------------------------------------------------
    {
      title: true,
      name: 'Project',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    // {
    //   name: 'Well',
    //   url: '/well',
    //   router: 'well',
    //   icon: 'fa fa-fire '
    // },
    {
      name: 'Area',
      url: '/admin-area-list',
      router: 'admin-area-list',
      icon: 'fa fa-cube'
    },
    {
      name: 'SEGY',
      url: '/admin-segy-list',
      router: 'admin-segy-list',
      icon: 'fa fa-hdd-o'
    },
    {
      name: 'Geobody',
      url: '/admin-geobody-list',
      router: 'admin-geobody-list',
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
