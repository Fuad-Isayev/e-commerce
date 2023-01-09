<template>
    <div>
        <v-card flat outlined>
            <div>
                <h3>{{ title }}</h3>
            </div>
            <v-card flat class="mx-auto">
                <v-list>
                    <v-list-item-group>
                        <v-list-item v-for="(item, i) in items" :key="i">
                            <v-list-item-content>
                                <v-list-item-title @click="selectItem(item.id, i)" class="mx-auto"
                                    v-text="(item.name || item)">
                                </v-list-item-title>
                            </v-list-item-content>
                            <div v-if="(selectedItem === i)">
                                <v-btn @click="toggleShowEdit" small class="edit-button"
                                    :color="showEdit ? null : 'success'">
                                    {{ showEdit? 'Cancel': 'Edit' }}
                                    <v-icon v-if="!showEdit">
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                            </div>
                            <v-expand-transition>
                                <div v-if="(showEdit && (selectedItem === i))" class="edit-buttons">
                                    <v-btn small class=" mb-1 d-block">
                                        <v-icon @click="toggleEditName(item, i)">
                                            mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn small>
                                        <v-icon @click="deleteItem(item.id || i)" color="red">
                                            mdi-trash-can-outline</v-icon>
                                    </v-btn>
                                </div>
                            </v-expand-transition>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card>
            <v-btn small color="primary" @click="toggleShowAddItems" v-if="!showAddItems"> + Add new</v-btn>
            <v-col class="d-flex justify-center">
                <v-form @submit.prevent="addItem(item)" v-if="showAddItems">
                    <v-text-field autofocus v-model="item" placeholder="Enter category">
                    </v-text-field>
                    <v-btn :x-small="isMobile" @click="addItem(item)" color="primary"> Submit
                    </v-btn>
                    <v-btn :x-small="isMobile" v-if="showAddItems" @click="toggleShowAddItems">
                        Cancel
                    </v-btn>
                </v-form>
            </v-col>
        </v-card>
        <v-dialog v-model="editName" overlay-opacity="0.3" width="300px">
            <v-card>
                <p class="text-center">Edit name</p>
                <v-text-field class="px-5" autofocus v-model="item">
                </v-text-field>
                <div class="text-center pb-2">
                    <v-btn @click="toggleEditName" color="error" class="mr-2">Cancel</v-btn>
                    <v-btn @click="editItem()" color="success">Submit</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "List",
    props: {
        items: Array,
        title: String,
    },
    data() {
        return {
            item: "",
            itemId: '',
            showAddItems: false,
            showEdit: false,
            editName: false,
            selectedItem: '',
        }
    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        }
    },
    methods: {
        toggleShowAddItems() {
            this.item = '';
            this.showAddItems = !this.showAddItems;
        },
        toggleShowEdit() {
            this.showEdit = !this.showEdit
        },
        toggleEditName(item, index) {
            this.showAddItems = false;
            this.editName = !this.editName;
            this.item = item.name || item;
            this.itemId = item.id || index;
        },
        selectItem(id, index) {
            this.selectedItem = index;
            this.$emit('selectItem', id);
        },
        addItem(item) {
            this.item = "";
            this.$emit('addItem', item);
            this.item = "";
        },
        editItem() {
            this.$emit('editItem', { id: this.itemId, name: this.item });
            this.itemId = '';
            this.editName = !this.editName;
            this.toggleShowEdit();
        },
        deleteItem(id) {
            this.$emit('deleteItem', id);
            this.toggleShowEdit();
        }
    }
}
</script>

<style scoped>
.edit-button {
    position: absolute;
    right: 10px;
    top: 10px;
}

.edit-buttons {
    position: absolute;
    z-index: 10;
    right: 10px;
    top: 45px
}
</style>