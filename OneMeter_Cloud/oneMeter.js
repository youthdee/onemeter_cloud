class Reading { //InitialReading, FirstReading, LastReading will inherit from this class

    //LastReading, FirstReading, InitialReading - TODO
    /*
    date; //string
    oBIS; //OBIS
    source; //string
    BATTERY_VOLTAGE; //number
    BATTERY_STATUS; //number
    BATTERY_PC; //number
    UUID; //string
    count; //number
    encryption; //string
    meterID; //string
    updatedAt; //UpdatedAt
    */

    lastReading; //LastReading
    firstReading; //FirstReading
    initialReading; //InitialReading

    source; // string
    oBIS; //OBIS
    date; //string

    constructor(date, source, BATTERY_VOLTAGE, BATTERY_STATUS, BATTERY_PC, UUID, count, encryption, meterID) {
        this.date = date;
        this.source = source;
        this.BATTERY_VOLTAGE = BATTERY_VOLTAGE;
        this.BATTERY_STATUS = BATTERY_STATUS;
        this.BATTERY_PC = BATTERY_PC;
        this.UUID = UUID;
        this.count = count;
        this.encryption = encryption;
        this.meterID = meterID;
    }
    /*
    static assign(source) {
        OneMeter.assign(OneMeter.Reading, source);
        this.oBIS = OBIS.assign(Array);
        this.lastReading = OneMeter.Reading.LastReading.assign(this.lastReading);
        this.initialReading = OneMeter.Reading.InitialReading.assign(this.initialReading);
        this.firstReading = OneMeter.Reading.FirstReading.assign(this.firstReading);

        //lastreading, firstreading, initialreading
    }
    */

    static assign(source) {
        Object.assign(Reading, source);
        this.oBIS = Reading.OBIS.assign(Array);
    }

    static OBIS = class { //todo konstanty

        ['0_0_0']; //string
        ['0_9_1']; //number
        ['0_9_2']; //string
        ['1_8_0']; //number
        ['1_8_1']; //number
        ['2_8_0']; //number
        ['C_1_0']; //string
        ['F_F_0']; //number
        ['S_1_1_6']; //number

        ['S_1_1_7']; //array number
        ['S_1_1_16']; //array number
        ['S_1_1_2']; //number

        ['S_1_1_9']; //number

        ['S_1_1_8']; //array number
        ['S_1_1_14']; //array number

        ['S_1_1_4']; //string

        constructor(_0_0_0, _0_9_1, _0_9_2, _1_8_0, _1_8_1, _2_8_0, _C_1_0, _F_F_0, _S_1_1_6, _S_1_1_7, _S_1_1_16, _S_1_1_2, _S_1_1_9, _S_1_1_8, _S_1_1_14, _S_1_1_4) {
            this['0_0_0'] = _0_0_0;
            this['0_9_1'] = _0_9_1;
            this['0_9_2'] = _0_9_2;
            this['1_8_0'] = _1_8_0;
            this['1_8_1'] = _1_8_1;
            this['2_8_0'] = _2_8_0;
            this['C_1_0'] = _C_1_0;
            this['F_F_0'] = _F_F_0;
            this['S_1_1_6'] = _S_1_1_6;
            this['S_1_1_7'] = _S_1_1_7;
            this['S_1_1_16'] = _S_1_1_16;
            this['S_1_1_2'] = _S_1_1_2;
            this['S_1_1_9'] = _S_1_1_9;
            this['S_1_1_8'] = _S_1_1_8;
            this['S_1_1_14'] = _S_1_1_14;
            this['S_1_1_4'] = _S_1_1_4;
        }



        static assing(source) {
            Reading.assign(Reading.OBIS, source);
        }
    }
}
class OBIS_Parameters { //Parent class

    key; //string
    constant; //bool
    category; //string
    subcategory; //string
    unit; //string
    description; //Description


    constructor(key, constant, category, subcategory, unit, shortcode) {
        this.key = key;
        this.constant = constant;
        this.category = category;
        this.subcategory = subcategory;
        this.unit = unit;
        this.shortcode = shortcode;
    }
    static Description = class {

        short; //string
        long; //string

        constructor(short, long) {
            this.short = short;
            this.long = long;
        }

        static assign(source) {
            OBIS_Parameters.assign(OBIS_Parameters.Description, source);
        }
    }

    static assign(source) {
        OneMeter.Meta.assign(OBIS_Parameters, source);
        this.description = OBIS_Parameters.Description.assign(this.description);
    }

}

class OneMeter { //todo dictionaries OBIS etc.
    _id; //string
    SN; //string
    MAC; //string
    type; //string
    disabled; //bool
    negativeEnergyExists; //bool
    own; //bool
    //['public']; //bool
    ['public']; //bool

    firstReading; //FirstReading
    lastReading; //LastReading
    initialReading; //InitialReading


    info; //Info
    meteringPoint; //MeteringPoint
    config; //Config

    timezone; //Timezone
    hardware; //Hardware
    branding; //Branding

    usage; //Usage
    production; //Production
    meta; //Meta
    metadata; //Metadata
    users; //Users
    owner; //Owner

    constructor(_id, SN, MAC, type, disabled, negativeEnergyExists, own, _public) {
        this._id = _id;
        this.SN = SN;
        this.MAC = MAC;
        this.type = type;
        this.disabled = disabled;
        this.negativeEnergyExists = negativeEnergyExists;
        this.own = own;
        this['public'] = _public;




    }

    static Info = class Info {
        name; //string
        manufacturer; //string
        protocol; //string

        location; //Location



        constructor(name, manufacturer, protocol) {
            this.name = name;
            this.manufacturer = manufacturer;
            this.protocol = protocol;

        }

        static Location = class {
            city; //string
            country; //string
            postal; //string
            street; //string
            constructor(city, country, postal, street) {
                this.city = city;
                this.country = country
                this.postal = postal;
                this.street = street;
            }

            static assign(source) {
                OneMeter.Info.assign(OneMeter.Info.Location, source);
            }
        }

        static assign(source) {
            OneMeter.assign(OneMeter.Info, source);
            this.location = OneMeter.Info.Location.assign(this.location);
        }
    }

    static MeteringPoint = class {
        meterID; //string

        static assign(source) {
            OneMeter.assign(OneMeter.MeteringPoint, source);
        }
        constructor(meterID) {
            this.meterID = meterID;
        }
    }

    static Config = class {
        multiplier; //int

        usageKeys; //UsageKeys

        idNumber; //int
        idkey; //string

        contract; //Contract Array
        uiConfig; //Uiconfig

        constructor(multiplier, idNumber, idKey) {
            this.multiplier = multiplier;
            this.idNumber = idNumber;
            this.idKey = idKey;
        }

        static assign(source) {
            OneMeter.assign(OneMeter.Config, source);
            this.usageKeys = OneMeter.Config.UsageKeys.assign(this.usageKeys);
            this.contract = OneMeter.Config.Contract.assign(this.contract);
            this.uiConfig = OneMeter.Config.UiConfig.assign(this.uiConfig);
        }

        static UsageKeys = class {

            activeEnergy; //string

            constructor(activeEnergy) {
                this.activeEnergy = activeEnergy;
            }

            static assign(source) {
                OneMeter.Config.assign(OneMeter.Config.UsageKeys, source);
            }
        }

        static Contract = class {
            //Contract je array
            static assign(source) {
                OneMeter.Config.assign(OneMeter.Config.Contract, source);
            }
        }

        static UiConfig = class {
            displayProjections; //bool
            usedTariff; //string
            constructor(displayProjections, usedTariff) {
                this.displayProjections = displayProjections;
                this.usedTariff = usedTariff;
            }
            static assign(source) {
                OneMeter.Config.assign(OneMeter.Config.UiConfig, source);
            }
        }
    }




    static InitialReading = class InitialReading extends Reading {


        BATTERY_VOLTAGE; //number
        BATTERY_STATUS; //number
        BATTERY_PC; //number

        constructor(date, source, BATTERY_VOLTAGE, BATTERY_STATUS, BATTERY_PC) {
            super(date, oBIS, source); //inherits from READING
            this.BATTERY_VOLTAGE = BATTERY_VOLTAGE;
            this.BATTERY_STATUS = BATTERY_STATUS;
            this.BATTERY_PC = BATTERY_PC;
        }

        static assign(source) {
            OneMeter.assign(OneMeter.InitialReading, source);
            //obisReading.assign(LastReading, source);
            this.oBIS = Reading.OBIS.assign(this.oBIS);
        }

    }
    static FirstReading = class FirstReading extends Reading {

        _id; //string
        UUID; //string
        encryption; //string
        meterID; //string

        constructor(date, oBIS, source, _id, UUID, encryption, meterID) {
            super(date, oBIS, source); //inherits from READING
            this._id = _id;
            this.UUID = UUID;
            this.encryption = encryption;
            this.meterID = meterID;
        }

        static assign(source) {
            OneMeter.assign(OneMeter.FirstReading, source);
            this.oBIS = Reading.OBIS.assign(this.oBIS);
        }

    }
    static LastReading = class LastReading extends Reading {

        BATTERY_VOLTAGE; //number
        BATTERY_STATUS; //number
        BATTERY_PC; //number
        UUID; //string
        count; //number
        encryption; //string
        meterID; //string
        updatedAt; //UpdatedAt


        constructor(date, source) {
            super(date, oBIS, source); //inherits from READING
            this.BATTERY_VOLTAGE = this.BATTERY_VOLTAGE;
            this.BATTERY_STATUS = this.BATTERY_STATUS;
            this.BATTERY_PC = this.BATTERY_PC;
            this.UUID = UUID;
            this.count = count;
            this.encryption = encryption;
            this.meterID = meterID;
            this.updatedAt = updatedAt;
        }

        static assign(source) {
            Reading.assign(OneMeter.LastReading, source);
            this.oBIS = Reading.OBIS.assign(this.oBIS);
            this.updatedAt = LastReading.UpdatedAt.assign(this.updatedAt);
        }

        //UdpatedAt Class
        static UpdatedAt = class {

            ['1_8_0']; //string
            ['1_8_1']; //string
            ['2_8_0']; //string
            ['1_8_2']; //string
            ['S_1_1_6']; //string
            ['S_1_1_7']; //string
            ['S_1_1_14']; //string
            ['S_1_1_16']; //string
            ['S_1_1_2']; //string
            ['S_1_1_8']; //string
            ['S_1_1_9']; //string
            ['S_1_1_4']; //string

            constructor(_1_8_0, _1_8_1, _2_8_0, _1_8_2, _S_1_1_6, _S_1_1_7, _S_1_1_14, _S_1_1_16, _S_1_1_2, _S_1_1_8, _S_1_1_9, _S_1_1_4) {
                this['1_8_0'] = _1_8_0;
                this['1_8_1'] = _1_8_1;
                this['2_8_0'] = _2_8_0;
                this['1_8_2'] = _1_8_2;
                this['S_1_1_6'] = _S_1_1_6;
                this['S_1_1_7'] = _S_1_1_7;
                this['S_1_1_14'] = _S_1_1_14;
                this['S_1_1_16'] = _S_1_1_16;
                this['S_1_1_2'] = _S_1_1_2;
                this['S_1_1_8'] = _S_1_1_8;
                this['S_1_1_9'] = _S_1_1_9;
                this['S_1_1_4'] = _S_1_1_4;
            }
            static assign(source) {
                OneMeter.LastReading.assign(OneMeter.LastReading.UpdatedAt, source);
            }

        }
    }



    static Timezone = class {
        name; //string
        constructor(name) {
            this.name = name;
        }

        static assign(source) {
            OneMeter.assign(OneMeter.Timezone, source);
        }
    }
    static Hardware = class {
        version; //string
        constructor(version) {
            this.version = version;
        }
        static assign(source) {
            OneMeter.assign(OneMeter.Hardware, source);
        }
    }
    static Branding = class {

        _id; //string
        name; //string
        logo; //string

        constructor(_id, name, logo) {
            this._id = _id;
            this.name = name;
            this.logo = logo;

        }

        static assign(source) {
            OneMeter.assign(OneMeter.Branding, source);
        }
    }


    static Usage = class {

        thisMonth; //number
        previousMonth; //number
        fullTime; //number
        lastHour; //number
        projection; //number
        projectionFillRatio; //number

        constructor(thisMonth, previousMonth, fullTime, lastHour, projection, projectionFillRatio) {
            this.thisMonth = thisMonth;
            this.previousMonth = previousMonth;
            this.fullTime = fullTime;
            this.lastHour = lastHour;
            this.projection = projection;
            this.projectionFillRatio = projectionFillRatio;
        }

        static assign(source) {
            OneMeter.assign(OneMeter.Usage, source);
        }
    }
    static Production = class {

        thisMonth; //number
        previousMonth; //number
        fullTime; //number
        lastHour; //number

        constructor(thisMonth, previousMonth, fullTime, lastHour) {
            this.thisMonth = thisMonth;
            this.previousMonth = previousMonth;
            this.fullTime = fullTime;
            this.lastHour = lastHour;
        }

        static assign(source) {
            OneMeter.assign(OneMeter.Production, source);
        }
    }
    static Meta = class {
        OBIS_0_0_0; //OBIS_Parameters
        OBIS_0_9_1; //OBIS_Parameters
        OBIS_0_9_2; //OBIS_Parameters
        OBIS_1_8_0; //OBIS_Parameters
        OBIS_1_8_1; //OBIS_Parameters
        OBIS_1_8_2; //OBIS_Parameters
        OBIS_2_8_0; //OBIS_Parameters
        OBIS_C_1_0; //OBIS_Parameters
        OBIS_F_F_0; //OBIS_Parameters
        OBIS_S_1_1_6; //OBIS_Parameters
        OBIS_S_1_1_7; //OBIS_Parameters
        OBIS_S_1_1_16; //OBIS_Parameters
        OBIS_S_1_1_2; //OBIS_Parameters
        OBIS_S_1_1_9; //OBIS_Parameters
        OBIS_S_1_1_8; //OBIS_ParametersF
        OBIS_S_1_1_14; //OBIS_Parameters
        OBIS_S_1_1_4; //OBIS_Parameters
        constructor() {

        }
        static ['0_0_0'] = class _0_0_0 extends OBIS_Parameters {

            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['0_9_1'] = class _0_9_1 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }

        }
        static ['0_9_2'] = class _0_9_2 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['1_8_0'] = class _1_8_0 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['1_8_1'] = class _1_8_1 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['1_8_2'] = class _1_8_2 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['2_8_0'] = class _2_8_0 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['C_1_0'] = class _C_1_0 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['F_F_0'] = class _F_F_0 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['S_1_1_6'] = class _S_1_1_6 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['S_1_1_7'] = class _S_1_1_7 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['S_1_1_16'] = class _S_1_1_16 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['S_1_1_2'] = class _S_1_1_2 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['S_1_1_9'] = class _S_1_1_9 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['S_1_1_8'] = class _S_1_1_8 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['S_1_1_14'] = class _S_1_1_14 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }
        static ['S_1_1_4'] = class _S_1_1_4 extends OBIS_Parameters {
            constructor(key, constant, category, subcategory, unit, shortcode) {
                super(key, constant, category, subcategory, unit, shortcode);
            }
        }

        static assign(source) {
            OneMeter.assign(OneMeter.Meta, source);
            this.OBIS_0_0_0 = OneMeter.Meta['0_0_0'].assign(this.OBIS_0_0_0);
            this.OBIS_0_9_1 = OneMeter.Meta['0_9_1'].assign(this.OBIS_0_9_1);
            this.OBIS_0_9_2 = OneMeter.Meta['0_9_2'].assign(this.OBIS_0_9_2);
            this.OBIS_1_8_0 = OneMeter.Meta['1_8_0'].assign(this.OBIS_1_8_0);
            this.OBIS_1_8_1 = OneMeter.Meta['1_8_1'].assign(this.OBIS_1_8_1);
            this.OBIS_1_8_2 = OneMeter.Meta['1_8_2'].assign(this.OBIS_1_8_2);
            this.OBIS_2_8_0 = OneMeter.Meta['2_8_0'].assign(this.OBIS_2_8_0);
            this.OBIS_C_1_0 = OneMeter.Meta['C_1_0'].assign(this.OBIS_C_1_0);
            this.OBIS_F_F_0 = OneMeter.Meta['F_F_0'].assign(this.OBIS_F_F_0);
            this.OBIS_S_1_1_6 = OneMeter.Meta['S_1_1_6'].assign(this.OBIS_S_1_1_6);
            this.OBIS_S_1_1_7 = OneMeter.Meta['S_1_1_7'].assign(this.OBIS_S_1_1_7);
            this.OBIS_S_1_1_16 = OneMeter.Meta['S_1_1_16'].assign(this.OBIS_S_1_1_16);
            this.OBIS_S_1_1_2 = OneMeter.Meta['S_1_1_2'].assign(this.OBIS_S_1_1_2);
            this.OBIS_S_1_1_9 = OneMeter.Meta['S_1_1_9'].assign(this.OBIS_S_1_1_9);
            this.OBIS_S_1_1_8 = OneMeter.Meta['S_1_1_8'].assign(this.OBIS_S_1_1_8);
            this.OBIS_S_1_1_14 = OneMeter.Meta['S_1_1_14'].assign(this.OBIS_S_1_1_14);
            this.OBIS_S_1_1_4 = OneMeter.Meta['S_1_1_4'].assign(this.OBIS_S_1_1_4);
        }
    }

    static Metadata = class {

        billingPeriods; //BillingPeriods

        constructor() {
            //this.billingPerdiods = billingPerdiods;
        }
        static assign(source) {
            OneMeter.assign(Metadata, source);
            this.billingPeriods = BillingPeriods.assign(this.billingPeriods);
        }
        static BillingPeriods = class {

            //array

            started; //string
            date; //string
            usages; //array numbers
            activeEnergy; //number
            activeEnergy_1; //number
            activeEnergy_2; //number
            negativeEnergy; //number
            reactiveEnergy; //number
            averagedCount; //number
            readoutCount; //number
            deltaMax; //number

            constructor(started, date, usages, activeEnergy, activeEnergy_1, activeEnergy_2, negativeEnergy, reactiveEnergy, averagedCount, readoutCount, deltaMax) {
                this.started = started;
                this.date = date;
                this.usages = usages;
                this.activeEnergy = activeEnergy;
                this.activeEnergy_1 = activeEnergy_1;
                this.activeEnergy_2 = activeEnergy_2;
                this.negativeEnergy = negativeEnergy;
                this.reactiveEnergy = reactiveEnergy;
                this.averagedCount = averagedCount;
                this.readoutCount = readoutCount;
                this.deltaMax = deltaMax;
            }

            static assign(source) {
                Metadata.assign(BillingPeriods, source);

            }


        }


    }
    static Users = class {

        displayName; //string
        email; //string
        grantedAt; //string

        constructor(displayName, email, grantedAt) {
            this.displayName = displayName;
            this.email = email;
            this.grantedAt = grantedAt;
        }
        static assign(source) {
            OneMeter.assign(Users, source);
        }
    }
    static Owner = class {

        name; //string
        email; //string

        constructor(name, email) {
            this.name = name;
            this.email = email;

        }

        static assign(source) {
            OneMeter.assign(Owner, source);
        }
    }
    static assign(source) {
        Object.assign(OneMeter, source);
        this.info = this.Info.assign(this.info);
        this.meteringPoint = this.MeteringPoint.assign(this.meteringPoint);
        this.config = this.Config.assign(this.config);

        this.firstReading = this.FirstReading.assign(this.firstReading);
        this.initialReading = this.InitialReading.assign(this.initialReading);
        this.lastReading = this.LastReading.assign(this.lastReading);



        this.timezone = this.Timezone.assign(this.timezone);
        this.hardware = this.Hardware.assign(this.hardware);
        this.branding = this.Branding.assign(this.branding);


        this.usage = this.Usage.assign(this.usage);
        this.production = this.Production.assign(this.production);
        this.meta = this.Meta.assign(this.meta);
        this.metadata = this.Metadata.assign(this.metadata);
        this.users = this.Users.assign(this.users);
        this.owner = this.Owner.assign(this.owner);
    }

}



module.exports = OneMeter, Reading, OBIS_Parameters;