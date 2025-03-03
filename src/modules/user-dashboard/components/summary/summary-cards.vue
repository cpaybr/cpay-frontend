<template>
  <div
    v-loading="isLoading"
    class="summary-cards mb-48">
    <app-wallet-card
      v-for="(card, i) in walletItems"
      :key="i"
      :title="card.title"
      :subtitle="card.subtitle"
      :prefix-symbol="card.prefixSymbol"
      :money-flow="card.moneyFlow"
      :img-url="card.imgUrl"
      :color="card.color"
      is-img-contain
      :value="card.value"
      :has-hover="false"/>
  </div>
</template>

<script lang="ts">

import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { IPlainObject } from '@/types/interfaces';
import AppWalletCard from '@/components/ui-kit/app-wallet-card.vue';
import AppDateRangeSelect from '@/components/ui-kit/app-date-range-select.vue';
import PageSubtitle from '@/modules/user-dashboard/components/page-subtitle.vue';
import { ReportsRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import { UserCoins } from '@/store/modules';
import { WALLET_FLOW_TYPES } from '@/constants/wallet-flow-types';
import {
  IReportsCoinOutflowsRecordClient,
} from '@/services/requests/reports/Reports.types';

@Component({
  components: { PageSubtitle, AppDateRangeSelect, AppWalletCard },
})
export default class SummaryCards extends Vue {

  @Prop({ type: Object, required: true }) readonly dateFilter!: object;

  @Prop({ type: Object, required: true }) readonly highestOutflowRecord!: IReportsCoinOutflowsRecordClient;

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected walletList: IPlainObject[] | null = null;

  protected isLoading: boolean = false;

  protected created(): void {
    this.fetchMoneyReport();
  }

  protected get currentCurrency(): string {
    return this.userCoinsModule.currentCurrency;
  }

  @Watch('currentCurrency')
  @Watch('dateFilter')
  protected updateSummaryData(): void {
    this.fetchMoneyReport();
  }

  protected async fetchMoneyReport(): Promise<void> {
    if (!(this.$route.params.serial || this.currentCurrency)) return;

    this.isLoading = true;
    const { response, error } = this.$route.params.serial
      ? await ReportsRequests.getMoneyReportBySerial(this.$route.params.serial, this.dateFilter)
      : await ReportsRequests.getMoneyReport({ currency: this.currentCurrency, ...this.dateFilter });

    if (error) {
      errorNotification(error);
    }

    this.walletList = [
      {
        title: this.$t('entity.money_flow.in'),
        subtitle: response?.currencyCode,
        prefixSymbol: response?.currencySymbol,
        moneyFlow: WALLET_FLOW_TYPES.in,
        color: '',
        value: response?.inflowSum,
      },
      {
        title: this.$t('entity.money_flow.out'),
        subtitle: response?.currencyCode,
        prefixSymbol: response?.currencySymbol,
        moneyFlow: WALLET_FLOW_TYPES.out,
        color: '',
        value: response?.outflowSum,
      },
    ];

    this.isLoading = false;
  }

  protected get walletItems(): IPlainObject {
    return [
      ...this.walletList || [],
      {
        title: this.highestOutflowRecord?.category?.name,
        subtitle: this.$t('entity.money_flow.most_expensive_category'),
        prefixSymbol: this.highestOutflowRecord?.currencySymbol,
        imgUrl: this.highestOutflowRecord?.category?.imageLink,
        color: this.highestOutflowRecord?.color,
        value: this.highestOutflowRecord?.sum,
      }];
  }

}
</script>

<style lang="scss">
.summary-cards {
  @apply grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 sm:min-h-150;
}
</style>
