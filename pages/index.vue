<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">

      <!-- 타이틀 -->
      <div>
        <b-form-group id="input-group-2" label="TITLE:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.title"
            placeholder="Enter Title"
            required
          ></b-form-input>
        </b-form-group>
      </div>

      <!-- 캘린더 -->
      <div>
        <label for="example-datepicker">Choose a date</label>
        <b-form-datepicker id="example-datepicker" v-model="form.date" class="mb-2"></b-form-datepicker>
        <p>Value: '{{ form.date }}'</p>
      </div>

      <!-- 인포 -->
      <div>
        <b-form-textarea
          id="textarea"
          v-model="form.info"
          placeholder="Enter something..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>

        <pre class="mt-3 mb-0">{{ form.info }}</pre>
      </div>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>


    <b-card-group deck>
      <b-card
        v-for="(item) in this.$store.state.memo"
        :key="item.id"
        border-variant="primary"
        :header="item.date"
        header-bg-variant="primary"
        header-text-variant="white"
        align="center"
      >

        
        <b-form-input :value="item.title" :ref="`updateTitle-${item.id}`"></b-form-input>
        <b-form-textarea :value="item.info" :ref="`updateInfo-${item.id}`"></b-form-textarea>

        <b-button variant="outline-primary" @click="deleteItem(item.id)">DELETE</b-button>
        <b-button variant="outline-primary" @click="updateItem(item.id)">UPDATE</b-button>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
  export default {
    async fetch() {
      await this.$store.dispatch('READ_MEMO');
    },
    data() {
      return {
        form: {
          title: '',
          date: '',
          info: '',
        },
        show: true,
        inFocus: false,
        updateInfo: '',
        updateTitle: '',
      }
    },
    methods: {
      async onSubmit(event) {
        event.preventDefault();
        const res = await this.$store.dispatch('CREATE_MEMO', this.form);
        if(res.status == 201) {
          this.$store.dispatch('READ_MEMO');
        }
        console.log(res);

        // alert(JSON.stringify(this.form))
      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.form.title = ''
        this.form.date = ''
        this.form.info = ''
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      },
      async deleteItem(id) {
        if (window.confirm('DELETE : ARE YOU SURE?')) {
          const res = await this.$store.dispatch('DELETE_MEMO', id);
          if(res.status == 200) {
            this.$store.dispatch('READ_MEMO');
          }
        }

        return false;
      },
      async updateItem(id){
        
        let filter = this.$store.state.memo.filter(v => {
          if(v.id == id) return true
        })
        const storeData = filter[0];
        // filter.title = this.$refs[`updateTitle-${id}`].value;
        let updateTitle = this.$refs[`updateTitle-${id}`][0].$el.value.trim();
        let updateInfo = this.$refs[`updateInfo-${id}`][0].$el.value.trim();

        let sendData = {}
        if(updateTitle != '' && updateTitle != storeData.title) {
          sendData.id = id;
          sendData.title = updateTitle;
        }
        if(updateInfo != '' && updateInfo != storeData.info) {
          sendData.id = id;
          sendData.info = updateInfo;
        }
        if(Object.keys(sendData).length > 0) {
          const res = this.$store.dispatch('UPDATE_MEMO', sendData);
          if(res.status == 200) {
            this.$store.dispatch('READ_MEMO');
          }
        }

        // console.log(data);
      },
      testFocus(){
        console.log('focus');
      },
      changeInput() {

      }
    }
  }
</script>