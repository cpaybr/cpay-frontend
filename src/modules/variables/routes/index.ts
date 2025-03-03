import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';

const Variables: AsyncComponent = () => import(/* webpackChunkName: 'variables' */ '@/modules/variables/pages/variables.vue');

export const VARIABLES: IRouteConfig = {
  path: '/dashboard/variables',
  name: 'Variables',
  component: Variables,
  meta: {
    permission: [ROLES.administrator],
    translation: 'navigation.link.variables',
    root: true,
    icon: 'icon-variables',
  },
};
