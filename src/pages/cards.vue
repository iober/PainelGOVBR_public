<template>
  <div id="q-app" class="q-pa-md">
    <q-dialog v-model="medium" class="dialog">
      <q-card>
        <q-card-section class="bg-primary text-white" style="min-width: 500px">
          <div class="text-h6">Adicionar Post-it</div>
        </q-card-section>
        <q-card-section>
          <div>
            <q-input
              outlined
              label="Título"
              maxlength="30"
              v-model="cardNovo.tituloCard"
              lazy-rules
              :rules="[val => !!val]"
            />
          </div>
            <div class="row">
              <div class="col-5" align="right">
                <q-checkbox left-label v-model="checklembrete" label="Criar Lembrete?" />
              </div>
              <div class="col">
              <q-input outlined v-model="cardNovo.dtCard" mask="##/##/####" placeholder="Data do Lembrete" :disable="checklembrete == false">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="cardNovo.dtCard" mask="DD/MM/YYYY" style="width: 10px">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              </div>
            </div>
        </q-card-section>
        <q-card-section>
          <div>
              <q-editor
                outlined
                label="Descrição do post-it."
                v-model="cardNovo.dsCard"
                placeholder="Descrição"
                :toolbar="[
                  ['left', 'center', 'right', 'justify','bold', 'italic','unordered', 'ordered']
                ]"
              />
          </div>
          <q-card-actions align="right">
            <q-btn color="primary" @click="cadCards()">Salvar</q-btn>
            <q-btn
              color="white"
              text-color="black"
              @click="limpaCampos(); checklembrete = false"
              label="Cancelar"
              v-close-popup
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div style="font-size: 12px; font-style: italic">*Utilize esse recurso para cadastrar notas de assuntos de baixa prioridade, lembretes, etc.</div>
    <div align="right">
      <q-btn
        stack push
        round
        color="light-blue-7"
        class="q-mr-md"
        icon="post_add"
        @click="medium = true"
      >
        <q-tooltip>Adicionar Post-it</q-tooltip>
      </q-btn>
    </div>

    <!-- aqui troca a cor depois de salvo -->
    <q-dialog v-model="corDialog">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Selecione a nova cor</div>
        </q-card-section>

        <q-card-section class="q-pa-sm q-gutter-xs" style="text-align: center">
          <q-radio
            keep-color
            v-model="novaCor.cor"
            val="bg-yellow-11"
            color="yellow"
          />
          <q-radio
            keep-color
            v-model="novaCor.cor"
            val="bg-pink-11"
            color="pink-11"
          />
          <q-radio
            keep-color
            v-model="novaCor.cor"
            val="bg-deep-orange-4"
            color="deep-orange-4"
          />
          <q-radio
            keep-color
            v-model="novaCor.cor"
            val="bg-green-12"
            color="green-12"
          />
          <q-radio
            keep-color
            v-model="novaCor.cor"
            val="bg-purple-3"
            color="purple-3"
          />
          <q-radio
            keep-color
            v-model="novaCor.cor"
            val="bg-light-blue-3"
            color="light-blue-3"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Salvar" v-close-popup @click="trocaCor()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- aqui começa o edit post -->
    <q-dialog v-model="diagCard" class="dialog">
      <q-card>
        <input hidden v-model="cardEdit.idCard" />
        <q-card-section class="bg-primary text-white" style="min-width: 500px">
          <div class="text-h6">Editar Lembrete</div>
        </q-card-section>
        <q-card-section>
          <div>
            <q-input
              outlined
              label="Título"
              maxlength="30"
              v-model="cardEdit.tituloCard"
            />
          </div>
            <div class="row q-pt-md">
              <div class="col-5" align="right">
                <q-checkbox left-label v-model="checklembrete" label="Criar Lembrete?" />
              </div>
              <div class="col">
                <q-input outlined v-model="cardEdit.dtCard" mask="##/##/####" placeholder="Data do Lembrete" :disable="checklembrete == false">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="cardEdit.dtCard" mask="DD/MM/YYYY" style="width: 10px">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
        </q-card-section>
        <q-card-section>
          <div>
              <q-editor
                outlined
                label="Descrição do post-it."
                v-model="cardEdit.dsCard"
                placeholder="Descrição"
                :toolbar="[
                  ['left', 'center', 'right', 'justify','bold', 'italic','unordered', 'ordered']
                ]"
              />
          </div>
          <q-card-actions align="right">
            <q-btn
              color="primary"
              @click="
                saveEdit(cardEdit.idCard);
                diagCard = false;
              "
              >Salvar</q-btn
            >
            <q-btn
              color="white"
              text-color="black"
              @click="limpaCampos(), checklembrete = false"
              label="Cancelar"
              v-close-popup
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card
       style="color:black"
        flat
        bordered
        :class="c.corCard"
        id="card"
        v-for="(c, key) in card"
        :key="key"
        class="tamCard"
      >
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">{{ c.tituloCard }}</div>
              <div class="text-overline" v-if="c.dtCard !== '00/00/0000'"> Lembrete: {{ c.dtCard }}</div>
            </div>

            <div class="col-auto">
              <q-btn color="black" round flat icon="more_vert" fixed-top-right>
                <q-tooltip>Opções</q-tooltip>
                <q-menu cover auto-close>
                  <q-list>
                    <q-item
                      clickable
                      @click="(corDialog = true), (idDiagCor = c.idCard)"
                    >
                      <q-item-section>Alterar cor</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      @click="
                        editCard(c.idCard, c.tituloCard, c.dsCard, c.dtCard);
                        diagCard = true;
                      "
                    >
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      @click="removeCard(c.idCard, c.tituloCard)"
                    >
                      <q-item-section>Remover</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section style="word-wrap: break-word">
          <span v-html="c.dsCard"/>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
import { Notify } from 'quasar'
export const required = (val) => !!val || 'Field is required'
export default {
  data () {
    return {
      checklembrete: false,
      medium: false,
      diagCard: false,
      isActive: '',
      idDiagCor: '',
      id: '',
      novaCor: {
        cor: ''
      },
      corDialog: false,
      cardNovo: {
        idUser: '',
        tituloCard: '',
        dsCard: '',
        corCard: 'bg-yellow-11',
        dtCard: '',
        envioEmail: 99
      },
      card: {
        idUser: '',
        tituloCard: '',
        dsCard: '',
        corCard: '',
        dtCard: ''
      },
      cardEdit: {
        idUser: '',
        tituloCard: '',
        dsCard: '',
        dtCard: '',
        envioEmail: ''
      },
      idUsuario: ''
    }
  },
  mounted () {
    this.isActive = 'my-card '.concat(this.card.corCard)
  },
  created () {
    /* BUSCA O USUÁRIO, SEU E-MAIL É SEU ID */
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.idUsuario = user.email
        this.carrega()
      }
    })
  },
  methods: {
    /* TROCA A COR SELECIONADA NO CARD */
    async trocaCor (id) {
      if (this.novaCor !== null || this.novaCor !== '') {
        const axiosConfig = {
          method: 'put',
          url: `/alteraCor/${this.idDiagCor}`,
          data: this.novaCor
        }
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'Cor alterada.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
      } else {
        Notify.create({
          message: 'Houve um problema. Escolha a cor corretamente.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
      this.carrega()
    },
    /* CARREGA TODOS OS CARDS DO USUÁRIO */
    carrega () {
      this.cardNovo.idUser = this.idUsuario
      this.$axios
        .get(`${process.env.API}/cards/${this.idUsuario}`)
        .then((response) => {
          this.card = response.data
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    },
    // Cadastra CARD
    async cadCards () {
      var cores = ['bg-yellow-11', 'bg-deep-orange-3', 'bg-light-blue-4', 'bg-pink-11', 'bg-green-12']
      var randomIndex = Math.floor(Math.random() * cores.length)
      this.cardNovo.corCard = cores[randomIndex]
      this.cardNovo.emailuser = this.idUsuario
      if (this.checklembrete === true) {
        this.cardNovo.envioEmail = 0
      }
      if (this.card.tituloCard !== '') {
        const axiosConfig = {
          method: 'post',
          url: `/cadCards`,
          data: this.cardNovo
        }
        this.diagCard = false
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        Notify.create({
          message: 'Lembrete cadastrado.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        this.medium = false
        this.limpaCampos()
        this.carrega()
        this.checklembrete = false
      } else {
        Notify.create({
          message: 'Ocorreu um erro. O título do lembrete é obrigatório.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    /* EDITA CARDS */
    editCard (id, titulo, dsc, dt) {
      if (dt !== '00/00/0000') {
        this.checklembrete = true
      } else {
        dt = ''
      }
      this.cardEdit.idCard = id
      this.cardEdit.tituloCard = titulo
      this.cardEdit.dsCard = dsc
      this.cardEdit.dtCard = dt
    },
    async saveEdit (idCard) {
      if (this.checklembrete === true) {
        this.cardEdit.envioEmail = 0
      }
      if (this.checklembrete === false) {
        this.cardEdit.envioEmail = 99
        this.cardEdit.dtCard = '000-00-00'
      }
      if (this.cardEdit.tituloCard !== '') {
        const axiosConfig = {
          method: 'put',
          url: `/alteraCard/${idCard}`,
          data: this.cardEdit
        }
        await this.$axios(axiosConfig.url, axiosConfig)
          .then((R) => R.data)
          .catch(this.AxiosCatch)
        this.carrega()
        this.checklembrete = false
        Notify.create({
          message: 'Lembrete alterado com sucesso.',
          position: 'bottom',
          color: 'green',
          timeout: 800
        })
        //  this.medium = false
      } else {
        Notify.create({
          message: 'Ocorreu um erro. O título é obrigatório.',
          position: 'bottom',
          color: 'red',
          timeout: 2000
        })
      }
    },
    /* DELETA CARDS */
    removeCard (idCard, titulo) {
      this.$q
        .dialog({
          title: 'Confirmação de exclusão',
          message: 'Lembrete: ' + titulo,
          persistent: false,
          ok: {
            push: true,
            label: 'Confirmar',
            color: 'red-8'
          },
          cancel: {
            push: true,
            color: 'light-blue-9',
            label: 'Cancelar'
          }
        })
        .onOk(() => {
          this.remover(idCard)
        })
        .onCancel(() => {})
    },
    async remover (idCard) {
      const axiosConfig = {
        method: 'delete',
        url: `/delCard/${idCard}`
      }
      await this.$axios(axiosConfig.url, axiosConfig)
        .then((R) => R.data)
        .catch(this.AxiosCatch)
      Notify.create({
        message: 'Lembrete removido.',
        position: 'bottom',
        color: 'red',
        timeout: 800
      })
      this.carrega()
    },
    /* LIMPA CAMPOS */
    limpaCampos () {
      this.cardNovo = {
        tituloCard: '',
        dsCard: ''
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.my-card
  min-width: 230px
  max-width: 230px
  min-height: 100px
  max-height: 100px

.dialog
  min-width: 500px

.tamCard
  min-width: 295px
  max-width: 295px
  min-height: 250px

</style>
