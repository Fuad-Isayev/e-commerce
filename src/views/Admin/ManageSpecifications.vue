<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-space-between">
                    <strong>CATEGORY: </strong>
                    <v-menu bottom offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn :small="isMobile" color="primary" dark v-bind="attrs" v-on="on">
                                {{ subcategory? subcategory.name : "Choose Category" }}
                            </v-btn>
                        </template>
                        <v-list height="300" class="overflow-auto">
                            <div v-for="(cat, index) in categories" :key="index">
                                <strong>{{ cat.name }}</strong>
                                <v-list-item-group>
                                    <v-list-item v-for="(subcategory, index) in cat.subcategories" :key="index"
                                        @click="chooseCategory(subcategory)">
                                        <v-list-item-title>{{ subcategory.name }}</v-list-item-title>
                                    </v-list-item>
                                </v-list-item-group>
                            </div>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row class="mt-10">
                <h4 class="text-center">Specifications : <span class="float-right">
                        <v-btn v-if="subcategory" @click="showEdit = !showEdit" color="success">
                            Edit
                        </v-btn>
                    </span></h4>
            </v-row>
            <v-row class="text-center text-body-2 text-sm-body-1 justify-center">
                <v-col v-if="showEdit" cols="1" class="px-0"></v-col>
                <v-col cols="2" class="px-0">Name</v-col>
                <v-col cols="2" class="px-0">Type</v-col>
                <v-col cols="4" class="px-0">Values</v-col>
                <v-col cols="1" class="px-0">
                    Multiple
                </v-col>
                <v-col v-if="showEdit" cols="1" class="px-0"></v-col>
                <v-col v-if="showEdit" cols="1" class="px-0"></v-col>
            </v-row>
            <div ref="container">
                <v-row ref='draggable' :id="spec.id" :draggable="allowDrag"
                    class="mt-5 text-center text-body-2 text-sm-body-1 justify-center"
                    v-for="(spec, i) in specifications" :key="i">
                    <v-col v-if="showEdit" cols="1" class="px-0">
                        <v-icon @touchstart="allowDrag = true" @mouseover="allowDrag = true"
                            @mouseleave="allowDrag = false" class="reorder-button">
                            mdi-menu
                        </v-icon>
                    </v-col>
                    <v-col cols="2" class="px-0">
                        {{ spec.name }}
                    </v-col>
                    <v-col cols="2" class="px-0">
                        {{ spec.type }}
                    </v-col>
                    <v-col cols="4" class="px-0 position-relative">
                        <div>
                            <span>
                                {{ spec.values ? spec.values[0] + " (+" + (spec.values.length - 1) + " more)" : "N/A" }}
                            </span>
                            <span>
                                <v-icon v-if="spec.values && spec.values.length > 1"
                                    :class="{ rotate: showValues === i }"
                                    @click="showValues = showValues === i ? null : i">
                                    mdi-chevron-down
                                </v-icon>
                            </span>
                        </div>
                        <div class="values" v-if="showValues === i">
                            <p v-for="value, i in spec.values" :key="i"> {{ value }}</p>
                        </div>
                    </v-col>
                    <v-col cols="1" class="px-0">
                        <v-checkbox class="multiple" readonly v-model="spec.multiple">
                        </v-checkbox>
                    </v-col>
                    <v-col v-if="showEdit" cols="2" class="px-0 d-flex justify-space-around">
                        <span>
                            <v-icon @click="editSpecification(spec)" class="me-1" color="success"> mdi-pencil
                            </v-icon>
                        </span>
                        <span>
                            <v-icon @click="deleteSpecification(subcategory, spec)" color="error"> mdi-trash-can
                            </v-icon>
                        </span>
                    </v-col>
                </v-row>
            </div>
            <v-row>
                <v-col class="text-center">
                    <v-btn v-if="subcategory" @click="editSpecification(null)" color="success">
                        + Add new
                    </v-btn>
                    <v-dialog v-model="showAddNew" scrollable light :width="isMobile ? '100%' : '50%'">
                        <template>
                            <AddSpecification :editingItem="editingSpecification" @close="showAddNew = !showAddNew"
                                :subcategory="subcategory" @itemAdded="getSpecifications(subcategory)" />
                        </template>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import AddSpecification from '@/views/Admin/Components/AddSpecification.vue';
import firebase from '../../../firebase';
import Swal from 'sweetalert2';

export default {
    name: "ManageSpecifications",
    components: {
        AddSpecification,
    },
    props: {
        isMobile: Boolean,
    },
    data() {
        return {
            subcategory: null,
            specification: {
                type: '',
                name: '',
                values: [],
                multiple: false,
            },
            types: ['color', 'number', "string"],
            specifications: [],
            showAddNew: false,
            showValues: null,
            showEdit: false,
            editingSpecification: null,
            afterElementId: '',
            allowDrag: false,
        }
    },
    mounted() {
        let container = this.$refs.container;
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(e.clientY);
            // const draggable = document.querySelector('.dragging');
            // if (afterElement == null) {
            //     container.appendChild(draggable)
            // } else {
            //     container.insertBefore(draggable, afterElement)
            // }
            this.afterElementId = afterElement?.id || null;
        })
    },
    computed: {
        categories() {
            return this.$store.state.categories;
        }
    },
    watch: {
        categories(val) {
            if (this.subcategory) {
                this.subcategory = val[this.subcategory.categoryId].subcategories[this.subcategory.id];
                this.getSpecifications(this.subcategory);
            }
        }
    },
    methods: {
        touchListen() {
            let draggables = this.$refs.draggable;
            let clone = null;

            draggables.forEach(draggable => {
                let box = null;
                draggable.addEventListener('touchstart', () => {
                    if (this.allowDrag) {
                        clone = draggable.cloneNode(true);
                        this.$refs.container.appendChild(clone);
                        clone.style.opacity = 0;
                        box = clone.getBoundingClientRect();
                    }
                })
                draggable.addEventListener('touchmove', e => {
                    e.preventDefault();
                    if (this.allowDrag) {
                        draggable.classList.add('dragging');
                        clone.style.opacity = 1;
                        clone.style.transform = "translate(0, " + (e.targetTouches[0].clientY - box.y - 32) + "px)";

                        this.afterElementId = this.getDragAfterElement(e.targetTouches[0].clientY)?.id || null;
                    }
                })
                draggable.addEventListener('touchend', () => {
                    if (this.allowDrag) {
                        this.reorderSpecifications(this.subcategory, draggable.id, this.afterElementId);
                        draggable.classList.remove('dragging');
                        this.$refs.container.removeChild(clone);
                        this.allowDrag = false;
                        this.afterElementId = null;
                    }
                })
            })
        },
        dragListen() {
            let draggables = this.$refs.draggable;

            draggables.forEach(draggable => {
                draggable.addEventListener('dragstart', () => {
                    draggable.classList.add('dragging');
                })

                draggable.addEventListener('dragend', () => {
                    this.reorderSpecifications(this.subcategory, draggable.id, this.afterElementId);
                    draggable.classList.remove('dragging');
                    this.allowDrag = false;
                })
            })
        },
        reorderSpecifications(subcategory, from, to) {
            console.log("IDS FOR FUNCTION: ", from, 'and ', to);
            if (from && to && from != to) {
                let url = 'https://e-commerce-b33a7-default-rtdb.firebaseio.com/categories/'
                    + subcategory.categoryId
                    + "/subcategories/"
                    + subcategory.id
                    + "/specifications.json";
                this.subcategory.specifications = this.$reorderByElement(subcategory.specifications, from, to);
                this.$reorderByUrl(url, from, to);
                this.getSpecifications(subcategory);
            }
        },
        getDragAfterElement(y) {
            const draggableElements = this.$refs.draggable;

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.y - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child }
                } else {
                    return closest
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element
        },
        chooseCategory(subcat) {
            this.subcategory = subcat;
            this.getSpecifications(subcat);
            this.$nextTick(() => { this.dragListen() });
            this.$nextTick(() => { this.touchListen() });
        },
        getSpecifications(cat) {
            if (cat.specifications) {
                this.specifications = Object.keys(cat.specifications).map((key) => {
                    return { ...cat.specifications[key], id: key }
                })
            } else {
                this.specifications = [];
            }
        },
        editSpecification(spec) {
            this.editingSpecification = spec;
            this.showAddNew = !this.showAddNew;
        },
        async deleteSpecification(subcat, spec) {
            Swal.fire({
                title: 'Are you sure you want to delete this category?',
                showDenyButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                denyButtonText: `Yes`,
            }).then(async (result) => {
                if (result.isDenied) {
                    await firebase.delete(`/categories/${subcat.categoryId}/subcategories/${subcat.id}/specifications/${spec.id}.json`);
                    this.$store.dispatch('getCategories');
                }
            })
        }
    }
}
</script>

<style scoped>
.v-chip.v-size--default {
    border-radius: 16px !important;
    font-size: 14px !important;
    max-height: 100% !important;
    max-width: 100% !important;
}

.v-input {
    height: 50px !important;
}

.v-input--selection-controls {
    margin: 0;
    padding: 0
}

.rotate {
    transform: rotate(-180deg);
}

.values {
    position: absolute;
    padding-top: 12px;
    opacity: 90%;
    top: 45px;
    width: 100%;
    text-align: center;
    left: 0;
    background-color: white;
    z-index: 100;
    border: 1px solid lightgray;
    border-radius: 20px;
}

.dragging {
    opacity: .5;
    background: rgba(135, 207, 235, 0.258);
}

.reorder-button:hover {
    cursor: move;
}
</style>

<style>
.multiple .v-input__slot {
    justify-content: center;
}
</style>