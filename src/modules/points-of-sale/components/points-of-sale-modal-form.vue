<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="posCompanyName">
      <app-input
        v-model="form.posCompanyName"
        label="form.label.pos_company_name"
        placeholder="pages.points_of_sale.placeholders.company_name"
        clearable/>
    </app-form-item>

    <app-form-item prop="description">
      <app-input
        v-model="form.description"
        label="form.label.description"
        placeholder="pages.points_of_sale.placeholders.description"
        clearable/>
    </app-form-item>

    <app-form-item prop="website">
      <app-input
        v-model="form.website"
        label="form.label.website"
        placeholder="placeholder.input.website"
        clearable/>
    </app-form-item>

    <app-form-item prop="serverUrl">
      <app-input
        v-model="form.serverUrl"
        label="form.label.server_url"
        placeholder="placeholder.input.server_url"
        clearable/>
    </app-form-item>

    <app-form-item prop="resultUrl">
      <app-input
        v-model="form.resultUrl"
        label="form.label.result_url"
        placeholder="placeholder.input.result_url"
        clearable/>
    </app-form-item>

    <app-form-item
      v-if="!isEditMode"
      prop="trustAllCertificates">
      <app-select
        v-model="form.trustAllCertificates"
        clearable
        full-width
        label="form.label.trust_certificates"
        placeholder="placeholder.select.select_option"
        :options="booleanOptions"
        option-label="label"
        option-value="value"/>
    </app-form-item>
    <app-form-item prop="categoryId">
      <app-select
        v-model="form.categoryId"
        clearable
        full-width
        label="form.label.category_id"
        placeholder="placeholder.select.select_option"
        :options="transactionCategoryList"
        option-label="name"
        option-value="id">
        <template #option="{scope}">
          {{ scope.name }} - {{ scope.code }}
        </template>
      </app-select>
    </app-form-item>

    <app-button
      class="btn-submit"
      full-width
      type="primary">
      {{ isEditMode ? $t('action.edit') : $t('action.create') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component,
  Ref,
  Prop,
  Emit,
  Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { errorNotification, successNotification } from '@/utils';
import { IPlainObject, IBooleanOptions } from '@/types/interfaces';
import {
  IPointsOfSaleEdit,
  IPointsOfSaleCreate,
  IPointsOfSaleResponse, IPointOfSaleRecord,
} from '@/services/requests/points-of-sale/PointsOfSale.types';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { PointsOfSaleRequests } from '@/services/requests';
import { ITransactionCategoryRecord } from '@/services/requests/transaction-categories/TransactionCategories.types';
import Catalog from '@/store/modules/dynamic/Catalog';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppSelect,
    AppInput,
    AppButton,
  },
})
export default class PointsOfSaleForm extends Vue {

  @Prop({ type: Object, default: () => ({}) }) readonly data!: IPointOfSaleRecord;

  @Prop({ type: Boolean, default: false }) readonly isEditMode!: boolean;

  @Ref('form') readonly appForm!: AppForm;

  @Emit('close')
  onCloseModal(): boolean {
    return true;
  }

  protected isLoading: boolean = false;

  protected catalogModule = getModule(Catalog, this.$store);

  protected booleanOptions: IBooleanOptions[] = [
    { label: this.$t('action.yes'), value: true },
    { label: this.$t('action.no'), value: false },
  ]

  protected rules: IPlainObject = {
    posCompanyName: SimpleRequiredValidationRule(),
    description: SimpleRequiredValidationRule(),
  };

  protected form: IPointsOfSaleEdit = {
    posCompanyName: '',
    description: '',
    website: '',
    serverUrl: '',
    resultUrl: '',
    categoryId: '',
    trustAllCertificates: null,
  }

  protected id: string = this.$route.params.id;

  protected get transactionCategoryList(): ITransactionCategoryRecord[] {
    return this.catalogModule.transactionCategories;
  }

  protected created() {
    if (this.isEditMode) {
      this.form = {
        posCompanyName: this.data.posCompanyName,
        description: this.data.description,
        website: this.data.website,
        serverUrl: this.data.serverUrl,
        resultUrl: this.data.resultUrl,
        trustAllCertificates: this.data.trustAllCertificates,
        categoryId: this.data.txCategoryId,
      };
    }
    this.catalogModule.fetchTransactionCategories();
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;
    this.isLoading = true;

    const payload: IPointsOfSaleEdit = (Object.keys(this.form) as Array<keyof IPointsOfSaleEdit>)
      .reduce(<K extends keyof IPointsOfSaleEdit>(acc: IPointsOfSaleEdit, key: K): IPointsOfSaleEdit => {
        if (this.form[key] || typeof this.form[key] === 'boolean') {
          acc[key] = this.form[key];
        }
        return acc;
      }, {} as IPointsOfSaleEdit);

    delete payload.id;
    delete payload.secretCode;

    const { error } = this.isEditMode ? await this.editPos(payload) : await this.createPos(payload);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onCloseModal();
  }

  protected async createPos(payload: IPointsOfSaleCreate): Promise<IPointsOfSaleResponse> {
    return PointsOfSaleRequests.createPointOfSale(payload);
  }

  protected async editPos(payload: IPointsOfSaleEdit): Promise<IPointsOfSaleResponse> {
    return PointsOfSaleRequests.editPointOfSale(payload, this.id);
  }

}
</script>
