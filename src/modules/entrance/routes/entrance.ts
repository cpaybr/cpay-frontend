import { AsyncComponent } from 'vue';
import { redirectLogged } from '@/router/middlewares/redirectLogged';
import { IRouteConfig } from '@/types/interfaces';

const isDemoMode = process.env.VUE_APP_DEMO_MODE === 'true';

const EntranceLayout: AsyncComponent = () => import(
  /* webpackChunkName: 'entrance-layout' */ '@/layouts/entrance-layout.vue'
);

const SignInRole: AsyncComponent = () => import(
  /* webpackChunkName: 'sign-in-role', webpackPrefetch: true, webpackPreload: true */
  '@/modules/entrance/pages/sign-in-role.vue'
);

const SignInManual: AsyncComponent = () => import(
  /* webpackChunkName: 'sign-in-manual', webpackPrefetch: true, webpackPreload: true */
  '@/modules/entrance/pages/sign-in-manual.vue'
);

const RecoverPassword: AsyncComponent = () => import(
  /* webpackChunkName: 'recover-password' */ '@/modules/entrance/pages/recover-password.vue'
);

const Registration: AsyncComponent = () => import(
  /* webpackChunkName: 'registration' */
  '@/modules/entrance/pages/registration.vue'
);

const ConfirmByOtp: AsyncComponent = () => import(
  /* webpackChunkName: 'confirm-by-otp' */
  '@/modules/entrance/pages/confirm-by-otp.vue'
);

const ENTRANCE_CHILDREN: IRouteConfig[] = [
  {
    path: 'sign-in',
    name: 'sign-in',
    component: SignInRole,
    meta: {
      disableGuard: true,
      middleware: [
        redirectLogged,
      ],
    },
  },
  {
    path: 'manual',
    name: 'sign-in-manual',
    component: SignInManual,
    meta: {
      disableGuard: true,
      middleware: [
        redirectLogged,
      ],
    },
  },
  {
    path: 'recover-password',
    name: 'recover-password',
    component: RecoverPassword,
    meta: {
      disableGuard: true,
      middleware: [
        redirectLogged,
      ],
    },
  },
  {
    path: 'registration',
    name: 'registration',
    component: Registration,
    meta: {
      disableGuard: true,
      middleware: [
        redirectLogged,
      ],
    },
  },
  {
    path: 'confirm-by-otp',
    name: 'confirm-by-otp',
    component: ConfirmByOtp,
    meta: {
      disableGuard: true,
      middleware: [
        redirectLogged,
      ],
    },
  },
];

export const ENTRANCE: IRouteConfig = {
  path: '/',
  name: 'entrance',
  component: EntranceLayout,
  redirect: isDemoMode ? ENTRANCE_CHILDREN[0] : ENTRANCE_CHILDREN[1],
  children: ENTRANCE_CHILDREN,
};
